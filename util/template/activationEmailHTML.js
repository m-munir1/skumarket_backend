const activationEmailHTML = () => {
  return `<!DOCTYPE html>
	<html>
	
	<head>
		<title>SKU Markets - Account Activation</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
		<meta name="author" content="SKU Markets" />
		<meta name="description" content="SKU Marktes" />
	
		<style>
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}
	
			body {
				font-family: 'Roboto', sans-serif;
				background-color: white;
			}
	
			.container {
				padding: 20px 30%;
			}
	
			.heading {
				text-align: center;
				margin-bottom: 20px;
			}
	
			.logo {
				text-align: center;
			}
	
			.title {
				background-color: #eee;
				padding: 50px 35px;
				text-align: left;
				clip-path: polygon(0 0, 70% 0, 100% 100%, 0% 100%);
			}
	
			.title h2 {
				max-width: 350px;
				font-size: 35px;
				font-weight: 500;
				line-height: 1.4;
			}
	
			.subtitle {
				margin: 25px auto;
				font-size: 18px;
				line-height: 1.5;
				font-weight: 500;
				max-width: 320px;
			}
	
			.msg_body {
				background-color: #eee;
				padding: 20px 15px;
			}
	
			.body_title {
				font-size: 25px;
				font-weight: 600;
				line-height: 1.4;
				margin-bottom: 10px;
				text-align: center;
			}
	
			.instruction_wrapper {
				display: grid;
				align-items: center;
				margin: 20px 0;
			}
	
			.instruction_wrapper:nth-of-type(odd) {
				grid-template-columns: 20fr 80fr;
			}
	
			.instruction_wrapper:nth-of-type(even) {
				grid-template-columns: 80fr 20fr;
			}
	
			.instruction_circle {
				width: 100px;
				height: 100px;
				border-radius: 50%;
				background-color: #0052FF;
			}
	
			.instruction_text {
				font-size: 18px;
				font-weight: 500;
				line-height: 1.5;
			}
	
			.bottom_blue {
				background-color: #0052FF;
				padding: 20px 15px;
				text-align: center;
				color: white;
			}
	
			.bottom_blue h4 {
				font-size: 25px;
				font-weight: 600;
				line-height: 1.4;
			}
	
			.bottom_blue p,
			.bottom_black p {
				max-width: 350px;
				text-align: center;
				margin: 10px auto;
			}
	
			.bottom_black {
				background-color: #000;
				color: white;
				padding: 20px 15px;
				text-align: center;
			}
		</style>
	</head>
	
	<body>
		<div class="container">
	
			<!-- Title/Top -->
			<div class="heading">
	
				<div class="logo">
					<img src="https://sku-markets.herokuapp.com/upload/cover/cover.jpg" alt="logo" crossorigin="anonymous"
						width="200px" height="90px">
				</div>
	
				<div class="title">
					<h2>Congratulations! <br> You are now a SKU Markets Seller</h2>
				</div>
	
				<div class="subtitle">
	
					<p class="">Your documents have been validated, and your SKU Markets Account is activated now.</p>
	
				</div>
			</div>
	
			<!-- Message Body -->
			<div class="msg_body">
				<h3 class="body_title">Here are some helpful tips <br> to help you get started</h3>
	
				<div class="instruction_wrapper">
					<div class="instruction_circle"></div>
					<p class="instruction_text">
						You must complete a trining session in order for your store to go live! Book into a training session to learn
						more about selling on SKU Markets.
					</p>
				</div>
	
				<div class="instruction_wrapper">
					<p class="instruction_text">
						You must complete a trining session in order for your store to go live! Book into a training session to learn
						more about selling on SKU Markets.
					</p>
					<div class="instruction_circle"></div>
				</div>
	
				<div class="instruction_wrapper">
					<div class="instruction_circle"></div>
					<p class="instruction_text">
						You must complete a trining session in order for your store to go live! Book into a training session to learn
						more about selling on SKU Markets.
					</p>
				</div>
			</div>
	
			<div class="bottom_blue">
				<h4>That's it!</h4>
				<p class="">We're looking forward to supporting your business success</p>
			</div>
	
			<div class="bottom_black">
				<p>For further assistance call us at <b>+1234567890</b> or send us email at <b><a href="mailto:info@skumarkets.com">info@skumarkets.com</a></b></p>
			</div>
		</div>
	</body>
	
	</html>`;
};

module.exports = activationEmailHTML;
