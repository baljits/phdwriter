function showRegistration()
{
	$("#signInForm").slideUp();
	$("#signUpForm").slideDown();
}

function hideRegistration()
{
	$("#signInForm").slideDown();
	$("#signUpForm").slideUp();
}

$(document).ready(function() {
	$('#signUpForm > form').validate({
		rules: {
			fullname: "required",
			email: {
				required: true,
				email: true
			},
			username: "required",
			password: "required",
			confirmPassword: {
				required: true,
				equalTo: "#password"
			}
		},
		messages: {
			fullname: "Please enter your Full name",
			email: {
				required: "Please enter an email address",
				email: "Please enter a valid email address"
			},
			password: {
				required: "Please provide a password"
			},
			confirmPassword: {
				required: "Please retype your password",
				equalTo: "Passwords do not match!"
			}
		}
	});
});