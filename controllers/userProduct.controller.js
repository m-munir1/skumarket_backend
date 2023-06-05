const catchAsyncErrors = require("../lib/catchAsyncErrors");
const AppError = require("../util/appError");
const UserProduct = require("../models/userproduct.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const _ = require("lodash");

exports.SellerProduct = async (body, user) => {
  let proarr = [];

  body.forEach(async (b) => {
    const product = await Product.findOne({
      sku_marketplace: b?.sku_marketplace,
      sku: b?.sku,
    });
    const sellerproduct = {
      productId: product?._id,
      SkuNumber: product?.sku,
      sku_marketplace: b?.sku_marketplace,
      status: body.status,
    };
    proarr.push(sellerproduct);
  });

  const data = await UserProduct.findOne({ user: user });
  if (data) {
    proarr.forEach(async (element) => {
      const ress = await UserProduct.updateOne(
        { user: user },
        { $push: { product: element } }
      );
    });

    return;
  }
  await UserProduct.create({
    user: user,
    product: proarr,
  });
};

exports.getSellerProduct = catchAsyncErrors(async (req, res, next) => {
  const user = req.params.userid;

  const product = await UserProduct.findOne({ user: user });
  if (!product) {
    return next(new AppError("Product not found"));
  }

  return res.status(200).json({ data: product });
});

// utility function
const getActiveProducts = async () => {
  const sellerProducts = await UserProduct.find().allowDiskUse(true);

  let activatedSKUs = [];

  sellerProducts.forEach((seller) => {
    seller.product?.map((prod) => {
      if (prod.status == true) {
        activatedSKUs.push({
          skuNumber: prod.SkuNumber,
          sku_marketplace: prod.sku_marketplace,
          user: seller.user,
          productId: prod.productId,
          partnerSku: prod.partnerSku,
        });
      }
    });
  });

  let uniqueActivatedSKUs = _.uniqWith(
    activatedSKUs,
    (a, b) =>
      a.skuNumber == b.skuNumber && a.sku_marketplace == b.sku_marketplace
  );

  let productIds = [];

  uniqueActivatedSKUs.map((sku) => {
    productIds.push(sku.productId);
  });

  return [productIds, activatedSKUs];
};

exports.getAllSellerProducts = catchAsyncErrors(async (req, res, next) => {
  const [productIds, activatedSKUs] = await getActiveProducts();

  let fields = req?.query?.fields;
  let limit = req?.query?.limit || 10;
  let page = req?.query?.page || 1;
  const skip = (page - 1) * limit;

  const sort = req.query.sort
    ? req.query.sort.split(",").join(" ")
    : "-createdAt";

  if (fields) {
    fields = fields.split(",").join(" ");
  } else {
    fields = "sku all_images current_price";
  }

  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);
  // 1B) Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(
    /\b(gte|gt|lte|lt|eq|ne|in)\b/g,
    (match) => `$${match}`
  );

  let products = await Product.find({ _id: { $in: productIds } })
    .find(JSON.parse(queryStr))
    .select(fields)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .allowDiskUse(true);

  products = products.map((prod) => {
    let sellerIds = activatedSKUs.filter(
      (sku) => prod._id.toString() == sku.productId
    );
    return {
      product: prod,
      sellerIds: sellerIds.map((o) => o.user.toString()),
    };
  });

  res.status(200).json({
    success: true,
    total: activatedSKUs.length,
    result: products.length,
    data: products,
  });
});

exports.getAllProductSellers = catchAsyncErrors(async (req, res, next) => {
  const sellers = await UserProduct.find(
    {
      "product.productId": req.params.id,
    },
    { user: 1, "product.status": 1, "product.productId": 1 }
  ).allowDiskUse(true);

  let objects = [];

  const promises = sellers.map(async (obj) => {
    if (
      obj.product.some(
        (product) =>
          product.productId == req.params.id && product.status == true
      )
    ) {
      const sellerName = await User.findById(obj.user).select("name");
      objects.push({ id: obj.user.toString(), name: sellerName.name });
    }
  });

  await Promise.allSettled(promises);

  res.status(200).json({
    success: true,
    total: objects.length,
    data: objects,
  });
});

exports.getAllCategoriesWithProducts = catchAsyncErrors(
  async (req, res, next) => {
    const [productIds, activatedSKUs] = await getActiveProducts();

    let fields = req?.query?.fields;

    if (fields) {
      fields = fields.split(",").join(" ");
    } else {
      fields =
        "_id category_en sku_marketplace sku_type_en sku_sub_type_en all_images";
    }

    let filter = { _id: { $in: productIds } };
    const allCategories = await Product.aggregate(
      [
        { $match: filter },
        {
          $group: {
            _id: {
              category_en: "$category_en",
              sku_marketplace: "$sku_marketplace",
            },
            doc: { $first: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: null,
            category_en: "$doc.category_en",
            sku_marketplace: "$doc.sku_marketplace",
          },
        },
      ],
      { allowDiskUse: true }
    );

    let projectKey = "doc";
    let projectObject = { id: `$${projectKey}._id` };
    fields.split(" ").map((field) => {
      projectObject = { ...projectObject, [field]: `$${projectKey}.${field}` };
    });

    let products = [];
    const promises = allCategories.map(async (category) => {
      let groupByField = "sku_type_en";

      // For SKU TYPES
      filter = {
        $and: [
          { category_en: category.category_en },
          { sku_marketplace: category.sku_marketplace },
          { [groupByField]: { $exists: true, $ne: "" } },
          { _id: { $in: productIds } },
        ],
      };

      const skuTypesCount = await Product.find(filter)
        .countDocuments()
        .allowDiskUse(true);

      // For Choosing SKU_SUB_TYPES
      if (skuTypesCount == 0) {
        groupByField = "sku_sub_type_en";

        filter = {
          $and: [
            { category_en: category.category_en },
            { sku_marketplace: category.sku_marketplace },
            { [groupByField]: { $exists: true, $ne: "" } },
            { _id: { $in: productIds } },
          ],
        };
      }

      let prod = await Product.aggregate(
        [
          { $match: filter },
          {
            $group: {
              _id: {
                [groupByField]: `$${groupByField}`,
              },
              [projectKey]: { $first: "$$ROOT" },
            },
          },
          {
            $facet: {
              count: [{ $count: "count" }],
              sample: [
                { $limit: 7 },
                {
                  $project: projectObject,
                },
              ],
            },
          },
        ],
        {
          allowDiskUse: true,
        }
      );

      let filteredProds = prod[0].sample?.map((prod) => {
        let sellerIds = activatedSKUs.filter(
          (sku) => prod._id.toString() == sku.productId
        );
        return {
          product: prod,
          sellerIds: sellerIds.map((o) => o.user.toString()),
        };
      });

      products.push({
        category_en: category.category_en,
        sku_marketplace: category.sku_marketplace,
        products: filteredProds,
        totalCount: prod[0].count[0].count,
      });
    });

    await Promise.allSettled(promises);

    products = _.orderBy(products, ["totalCount"], ["desc"]);

    res.status(200).json({
      success: true,
      total: products.length,
      result: products.length,
      data: products,
    });
  }
);

exports.getAllCategories = catchAsyncErrors(async (req, res, next) => {
  const [productIds, activatedSKUs] = await getActiveProducts();

  let filter = { _id: { $in: productIds } };

  const allMarketplaces = await Product.aggregate(
    [
      { $match: filter },
      {
        $group: {
          _id: {
            sku_marketplace: "$sku_marketplace",
          },
          doc: { $first: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          sku_marketplace: "$doc.sku_marketplace",
        },
      },
    ],
    { allowDiskUse: true }
  );

  let categories = [];
  const promises = allMarketplaces.map(async (obj) => {
    filter = {
      $and: [
        { sku_marketplace: obj.sku_marketplace },
        { _id: { $in: productIds } },
      ],
    };
    let cat = await Product.aggregate(
      [
        { $match: filter },
        {
          $group: {
            _id: {
              category_en: "$category_en",
            },
            doc: { $first: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 0,
            category_en: "$doc.category_en",
          },
        },
      ],
      {
        allowDiskUse: true,
      }
    );

    categories.push({
      sku_marketplace: obj.sku_marketplace,
      categories: cat,
    });
  });

  await Promise.allSettled(promises);

  categories.sort((a, b) => a.categories.length > b.categories.length);

  res.status(200).json({
    success: true,
    total: categories.length,
    result: categories.length,
    data: categories,
  });
});

exports.getAllCategoryTypesWithProducts = catchAsyncErrors(
  async (req, res, next) => {
    const [productIds, activatedSKUs] = await getActiveProducts();

    let fields = req?.query?.fields;
    let category = req?.query?.category;
    let marketplace = req?.query?.marketplace;
    // let limitTypes = Number(req?.query?.limitTypes) || 5;
    let limitProducts = Number(req?.query?.limitProducts) || 10;

    if (fields) {
      fields = fields.split(",").join(" ");
    } else {
      fields =
        "_id category_en sku_marketplace sku_type_en sku_sub_type_en all_images";
    }

    let projectKey = "doc";
    let projectObject = { id: `$${projectKey}._id` };
    fields.split(" ").map((field) => {
      projectObject = { ...projectObject, [field]: `$${projectKey}.${field}` };
    });

    let groupByField = "sku_type_en";

    // For SKU TYPES
    let filter = {
      $and: [
        { category_en: category },
        { sku_marketplace: marketplace },
        { [groupByField]: { $exists: true, $ne: "" } },
        { _id: { $in: productIds } },
      ],
    };

    const skuTypesCount = await Product.find(filter)
      .countDocuments()
      .allowDiskUse(true);

    // For Choosing SKU_SUB_TYPES
    if (skuTypesCount == 0) {
      groupByField = "sku_sub_type_en";

      filter = {
        $and: [
          { category_en: category },
          { sku_marketplace: marketplace },
          { [groupByField]: { $exists: true, $ne: "" } },
          { _id: { $in: productIds } },
        ],
      };
    }

    const allTypes = await Product.aggregate(
      [
        { $match: filter },
        {
          $group: {
            _id: {
              [groupByField]: `$${groupByField}`,
            },
            [projectKey]: { $first: "$$ROOT" },
          },
        },
        // { $limit: limitTypes },
        {
          $project: {
            _id: 0,
            [groupByField]: `$doc.${groupByField}`,
          },
        },
      ],
      {
        allowDiskUse: true,
      }
    );

    let products = [];
    const promises = allTypes.map(async (type) => {
      filter = {
        $and: [
          { category_en: category },
          { sku_marketplace: marketplace },
          { [groupByField]: type[groupByField] },
          { _id: { $in: productIds } },
        ],
      };

      let prod = await Product.aggregate(
        [
          { $match: filter },
          {
            $group: {
              _id: {
                [groupByField]: `$${groupByField}`,
              },
              [projectKey]: { $first: "$$ROOT" },
            },
          },
          {
            $facet: {
              count: [{ $count: "count" }],
              sample: [
                { $limit: limitProducts },
                {
                  $project: projectObject,
                },
              ],
            },
          },
        ],
        {
          allowDiskUse: true,
        }
      );

      let filteredProds = prod[0].sample?.map((prod) => {
        let sellerIds = activatedSKUs.filter(
          (sku) => prod._id.toString() == sku.productId
        );
        return {
          product: prod,
          sellerIds: sellerIds.map((o) => o.user.toString()),
        };
      });

      products.push({
        category,
        sku_marketplace: marketplace,
        [groupByField]: type[groupByField],
        products: filteredProds,
        totalCount: prod[0].count[0].count,
      });
    });

    await Promise.allSettled(promises);

    products = _.orderBy(products, ["totalCount"], ["desc"]);

    res.status(200).json({
      success: true,
      total: products.length,
      result: products.length,
      data: products,
    });
  }
);

exports.getSpecifiedProducts = catchAsyncErrors(async (req, res, next) => {
  const [productIds, activatedSKUs] = await getActiveProducts();

  let fields = req?.body?.fields;

  const sort = req.body.sort
    ? req.body.sort.split(",").join(" ")
    : "-createdAt";

  if (fields) {
    fields = fields.split(",").join(" ");
  } else {
    fields = "sku all_images current_price";
  }

  if (!req?.body?.ids) {
    res.status(200).json({
      success: true,
      total: 0,
      result: 0,
      data: [],
    });
    return;
  }

  let products = await Product.find({ _id: { $in: productIds } })
    .find({ _id: { $in: req?.body?.ids } })
    .select(fields)
    .sort(sort)
    .allowDiskUse(true);

  products = products.map((prod) => {
    let sellerIds = activatedSKUs.filter(
      (sku) => prod._id.toString() == sku.productId
    );
    return {
      product: prod,
      sellerIds: sellerIds.map((o) => o.user.toString()),
    };
  });

  res.status(200).json({
    success: true,
    total: activatedSKUs.length,
    result: products.length,
    data: products,
  });
});

exports.getSearchedProducts = catchAsyncErrors(async (req, res, next) => {
  const [productIds, activatedSKUs] = await getActiveProducts();

  const query = req?.query?.key;
  let page = Number(req?.query?.page) || 1;
  let limit = Number(req?.query?.limit) || 50;

  let fields = req?.query?.fields;

  const sort = req.query.sort
    ? req.query.sort.split(",").join(" ")
    : "-createdAt";

  if (fields) {
    fields = fields.split(",").join(" ");
  } else {
    fields = "_id sku sku_marketplace";
  }

  if (query == "") {
    res.status(200).json({
      success: false,
      data: {},
    });

    return;
  }

  // create regular expression pattern based on search query
  const keywords = query.split(" ");
  const pattern = new RegExp(keywords.join("|"), "i");

  let filter;

  filter = {
    $and: [
      {
        $or: [
          { sku: pattern },
          { title_en: pattern },
          { description_en: pattern },
        ],
      },
      { _id: { $in: productIds } },
    ],
  };

  let totalCount = await Product.aggregate(
    [{ $match: filter }, { $group: { _id: null, count: { $sum: 1 } } }],
    { allowDiskUse: true }
  );

  totalCount = totalCount.length ? totalCount[0].count : 0;

  // Setting SKU fields
  let projectKey = "doc";
  let projectObject = { _id: `$${projectKey}._id`, id: `$${projectKey}._id` };
  fields.split(" ").map((field) => {
    projectObject = { ...projectObject, [field]: `$${projectKey}.${field}` };
  });

  let skus = await Product.aggregate(
    [
      { $match: filter },
      {
        $group: {
          _id: {
            sku: `$sku`,
            sku_marketplace: `$sku_marketplace`,
          },
          [projectKey]: { $first: "$$ROOT" },
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: projectObject,
      },
    ],
    {
      allowDiskUse: true,
    }
  );

  filter = {
    $and: [{ sku_marketplace: pattern }, { _id: { $in: productIds } }],
  };

  const marketplaces = await Product.aggregate(
    [
      { $match: filter },
      {
        $group: {
          _id: {
            sku_marketplace: `$sku_marketplace`,
          },
          doc: { $first: "$$ROOT" },
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          sku_marketplace: `$doc.sku_marketplace`,
        },
      },
    ],
    {
      allowDiskUse: true,
    }
  );

  filter = {
    $and: [{ category_en: pattern }, { _id: { $in: productIds } }],
  };

  const categories = await Product.aggregate(
    [
      { $match: filter },
      {
        $group: {
          _id: {
            category_en: `$category_en`,
            sku_marketplace: `$sku_marketplace`,
          },
          doc: { $first: "$$ROOT" },
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          category_en: `$doc.category_en`,
          sku_marketplace: `$doc.sku_marketplace`,
        },
      },
    ],
    {
      allowDiskUse: true,
    }
  );

  filter = {
    $and: [{ brand_en: pattern }, { _id: { $in: productIds } }],
  };

  const brands = await Product.aggregate(
    [
      { $match: filter },
      {
        $group: {
          _id: {
            brand_en: `$brand_en`,
            sku_marketplace: `$sku_marketplace`,
          },
          doc: { $first: "$$ROOT" },
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          brand_en: `$doc.brand_en`,
          sku_marketplace: `$doc.sku_marketplace`,
        },
      },
    ],
    {
      allowDiskUse: true,
    }
  );

  skus = skus.map((prod) => {
    let sellerIds = activatedSKUs.filter(
      (sku) => prod._id.toString() == sku.productId
    );
    return {
      product: prod,
      sellerIds: sellerIds.map((o) => o.user.toString()),
    };
  });

  res.status(200).json({
    success: true,
    data: { skus, marketplaces, categories, brands },
    totalCountSKUs: totalCount,
  });
});

exports.getPartnerSkuByProductId = catchAsyncErrors(async (req, res, next) => {
  let id = req?.params?.id;

  const partnerSku = await UserProduct.findOne({ "product.productId": id })
    .select({ "product.partnerSku.$": 1 })
    .limit(1)
    .allowDiskUse(true);

  res.status(200).json({
    success: true,
    data: partnerSku?.product[0]?.partnerSku,
  });
});
