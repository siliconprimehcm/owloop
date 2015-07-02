(function() {
    angular.module('validation.rule', ['validation'])
        .config(['$validationProvider',
            function($validationProvider) {

                var expression = {
                    required: function(value) {
                        return !!value;
                    },
                    url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                    email: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
                    number: /^\d+$/,
                    minlength: function(value, scope, element, attrs, param) {
                        return value.length >= param;
                    },
                    maxlength: function(value, scope, element, attrs, param) {
                        return value.length <= param;
                    },
                    confirmpassword: function (value) {
                        return value == $('[name=password]').val();
                    },
                    passwordlength: function (value, scope, element, attrs, param) {
                        return value.length >= param;
                    },
                };

                var defaultMsg = {
                    required: {
                        error: 'This should be Required!!',
                        success: ''
                    },
                    url: {
                        error: 'This should be Url',
                        success: ''
                    },
                    email: {
                        error: 'Email invalid',
                        success: ''
                    },
                    number: {
                        error: 'This should be Number',
                        success: ''
                    },
                    minlength: {
                        error: 'This should be longer',
                        success: ''
                    },
                    maxlength: {
                        error: 'This should be shorter',
                        success: ''
                    },
                    confirmpassword: {
                        error: 'The 2 passwords you input do not match. Make sure there is no typo involved!',
                        success: ''
                    },
                    passwordlength: {
                        error: 'Password needs to contain at least 6 characters',
                        success: ''
                    }
                };
                $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);

            }
        ]);

}).call(this);
