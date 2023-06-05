const verifyEmailHTML = (url) => {
  return `<!DOCTYPE html>
	<html>
	
	<head>
		<title>SKU Markets - Email Verification</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	
		<!-- <meta http-equiv="refresh" content="1" > -->
	
		<meta name="author" content="SKU Markets" />
		<meta name="description" content="SKU Marktes" />
	
		<!-- bootstrap css -->
	
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
			integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
	
	
		<style>
			* {
				padding: 0;
				margin: 0;
				box-sizing: border-box;
				scroll-behavior: smooth;
			}
	
			a {
				text-decoration: none !important;
				color: #000 !important;
			}
	
			li {
				list-style: none;
			}
	
			ul {
				padding: 0 !important;
				margin: 0 !important;
			}
	
			body {
				font-family: Nunito, sans-serif !important;
				margin: 0 auto !important;
			}
	
			img {
				vertical-align: middle;
				text-align: center;
			}
	
			a {
				color: #FFF;
				font-size: 10px;
			}
	
			.text-green {
				color: green !important;
			}
	
			.text-bold {
				font-weight: bold;
			}
	
			.logo {
				text-align: center;
			}
	
			.email-body {
				background: white;
				justify-content: center;
				display: flex;
			}
	
			.email-card {
				width: 40%;
				height: auto;
				margin: 0 auto;
				position: relative;
				display: flex;
				flex-direction: column;
				padding: 10px;
				min-width: 0;
				word-wrap: break-word;
				background-color: #fff;
				background-clip: border-box;
				border: 1px solid rgba(0, 0, 0, .125);
				border-radius: 0.25rem;
				box-shadow: 0px 0px 35px 0px rgba(154, 161, 171, 0.15);
			}
	
			.mail-logo {
				text-align: center;
				padding-top: 50px;
			}
	
			.mail-title {
				margin: 0 auto;
				padding-top: 15px;
				padding-bottom: 15px;
				border-bottom: 1px solid #DAE1E9;
				width: 90%;
				text-align: center;
			}
	
			.mail-title span {
				color: #6C757D;
				font-size: 20px;
				text-align: center;
			}
	
			.mail-text1 {
				margin: 0 auto;
				padding-top: 15px;
				padding-bottom: 15px;
				text-align: center;
			}
	
			.mail-text1 span {
				color: #6C757D;
				font-size: 12px;
			}
	
			.mail-btn {
				width: 95%;
				background: darkgray;
				margin: 0 auto;
				text-align: center;
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 20px;
				cursor: pointer;
				border-radius: 5px;
				transition: 1s;
				margin-bottom: 35px;
				padding: 10px;
			}
	
			.mail-btn a {
				color: white !important;
				font-size: 12px;
			}
	
			.mail-btn:hover {
				background: #0052ff;
			}
	
			.btn-border {
				width: 70px;
				height: 2px;
				background: #DAE1E9;
				margin: 0 auto;
			}
	
			.mail-text2 {
				margin: 0 auto;
				padding: 35px 0 15px 0;
				text-align: center;
			}
	
			.mail-text2 span {
				color: #6C757D;
				font-size: 12px;
			}
	
			.mail-footer {
				margin: 0 auto;
				padding-top: 25px;
			}
	
			.mail-footer .footer-title {
				text-align: center;
			}
	
			.footer-title {
				padding-bottom: 10px;
			}
	
			.footer-title a {
				color: #6C757D !important;
				font-size: 14px !important;
				border-bottom: 1px solid #DAE1E9;
			}
	
			.footer-title a:hover {
				color: #0052ff !important;
				border-color: #0052ff;
			}
	
			.mail-footer-text1 {
				margin: 0 auto;
				text-align: center;
				font-size: 12px;
			}
	
			.mail-footer-text1 p {
				padding-bottom: 10px;
				margin: 0px;
				color: #6C757D !important;
			}
	
			.mail-footer-text1 a {
				color: #6C757D !important;
				font-size: 14px !important;
				border-bottom: 1px solid #DAE1E9;
				color: #6C757D !important;
			}
	
			.mail-footer-text1 a:hover {
				color: #0052ff !important;
				border-color: #0052ff;
			}
	
			.social-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 0 15px;
				margin: 20px auto;
				color: #0052FF;
			}
	
			@media only screen and (max-width: 768px) {
				.email-card {
					width: 60%;
				}
			}
	
			@media only screen and (max-width: 600px) {
				.email-card {
					width: 95%;
				}
			}
		</style>
	</head>
	
	<body>
	
		<!-- email alert title section start here -->
	
		<div class="container-fluid">
			<div class="row">
				<div class="col-md-12 logo">
					<img src="https://sku-markets.herokuapp.com/upload/cover/cover.jpg" alt="logo" crossorigin="anonymous"
						width="200px" height="90px">
				</div>
			</div>
		</div>
	
		<!-- email alert body section start here -->
	
		<div class="container-fluid">
			<div class="row">
				<div class="">
					<div class="col-md-12">
						<div class="email-body">
							<div class="email-card">
								<div class="mail-logo">
									<img src="https://sku-markets.herokuapp.com/upload/avatar/email.png" alt="email" crossorigin="anonymous"
										width="80px">
								</div>
								<div class="mail-title">
									<span>Verify your email address</span>
								</div>
								<div class="mail-text1">
									<span>In order to start using your SKU Markets account, you need to confirm your email address.</span>
								</div>
								<div class="mail-btn">
									<a href=${url} target="_blank">Verify Email Address</a>
								</div>
	
								<div class="btn-border"></div>
	
								<div class="mail-text2">
									<span>If you did not sign up for this account you can ignore this email and the account will be
										deleted.</span>
								</div>
							</div>
						</div>
						<div class="mail-footer">
							<div class=" footer-title">
								<a href="https://skumarkets.com" target="_blank">Get Started</a>
							</div>
	
							<div class="mail-footer-text1">
								<a href="https://skumarkets.com/policies" target="_blank">Terms of Service</a>
								<p style="padding-top: 15px;">© SKU Markets 2022 - 2023</p>
								<p>A Complete Insights, Analytics, Statistics & Management Platform Built to Supercharge Your E-commerce
								</p>
								<p>List of top Live SKU prices of 10,000,000 different online SKUs. A complete list with SKU markets
									rankings, <br>trade volume and value charts as of today Middle East</p>
							</div>
	
							<!-- footer -->
	
							<div class="social-icon">
								<a href="https://api.whatsapp.com/send?phone=966570044545" target="_blank">
									<img src="https://cdn-icons-png.flaticon.com/512/124/124034.png" alt="whatsapp" crossorigin="anonymous"
										width="25px" height="25px">
								</a>
								<a href="https://twitter.com/SKUmarkets">
									<img src="https://cdn-icons-png.flaticon.com/512/3256/3256013.png" alt="twitter" crossorigin="anonymous"
										width="25px" height="25px">
								</a>
								<a href="mailto:support@skumarkets.com">
									<img src="https://cdn-icons-png.flaticon.com/512/5968/5968534.png" alt="mail" crossorigin="anonymous"
										width="25px" height="25px">
								</a>
								<a href="https://www.linkedin.com/company/sku-markets">
									<img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="linkedin" crossorigin="anonymous"
										width="25px" height="25px">
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	
	</body>
	
	</html>`;
};

module.exports = verifyEmailHTML;
