var landingPageModule = angular.module('owloop.landingPage', []);

landingPageModule.controller('landingController', function($scope, $state) {
    
    function next_slide() {
        var active = $('#iphone-overlay img.active');
        if (active.length == 0) active = $('#iphone-overlay img:last');
        var next = active.next().length ? active.next() : $('#iphone-overlay img:first');
        active.addClass('last-active');
        next.css({ opacity: 0.0 }).addClass('active').animate({ opacity: 1.0 }, 1500, function () {
            active.removeClass('active last-active');
        });
        setTimeout("next_slide()", 5000);
    }

    $(function () {
        setTimeout("next_slide()", 5000);
    });

    $("#MyContactForm").submit(function (event) {
        event.preventDefault();
        var email = $(this).find("input").val();
        SuscribeEmail(email);
    });

    function SubcribeFunction() {
        var email = $("#txtEmail").val();
        SuscribeEmail(email);
    };

    function SuscribeEmail(email) {
        var model = {
            "email": email,
        };
        $.ajax({
            type: "post",
            url: "/subscribeapi1/api/Subcribe/InsertSubcribe",
            //datatype: "jsonp",
            crossdomain: true,
            data: model,
            success: function (msg) {
                $("#txtEmail").val('');
            },
            error: function (jqxhr, textstatus, errorthrown) {
                //window.location = "/thankyou.html";
                alert("sorry, there seems to be an error on the server. please try again later.");
                l.stop();
            }
        });
    }
});