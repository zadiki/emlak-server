$(document).ready(function () {
    var landhtml = '<div class="form-row">\n' +
        '                    <div class="form-group col-md-2">\n' +
        '                        <label for="inputplotsize">size(acres)</label>\n' +
        '                        <input type="text" name="plotsize" class="form-control" placeholder="plot size" id="inputplotsize"/>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-md-4">\n' +
        '                        <label for="inputdistance">Distance tarmak</label>\n' +
        '                        <input type="text" name="plot_road_distance" class="form-control" placeholder="plot distance from tarmak road" id="inputdistance"/>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-md-6">\n' +
        '                        <label for="inputdescription" >Description</label>\n' +
        '                        <textarea name="description" class="form-control" maxlength="150" id="inputdescription" placeholder="describe in 150 characters"></textarea>\n' +
        '                    </div>\n' +
        '                </div>';

    var hotelhtml = ' <div class="form-row">\n' +
        '                    <div class="form-group col-md-4">\n' +
        '                        <label for="inputbedsize">Bedsize</label>\n' +
        '                        <select name="hotel_bedsize" class="form-control" id="inputbedsize">\n' +
        '                            <option >Twin size/</option>\n' +
        '                            <option >Twin size/</option>\n' +
        '                            <option >Twin size/</option>\n' +
        '                        </select>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-md-4">\n' +
        '                        <label for="inputbednumber">beds per room</label>\n' +
        '                        <select name="hotel_bed_number" class="form-control" id="inputbednumber">\n' +
        '                            <option value="1" selected>one</option>\n' +
        '                            <option value="1">two</option>\n' +
        '                            <option value="1">three</option>\n' +
        '                            <option value="1">four</option>\n' +
        '                            <option value="1">five</option>\n' +
        '                        </select>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-md-4">\n' +
        '                        <label for="inputbreakfast">Breakfast</label>\n' +
        '                        <select name="breakfast" class="form-control" id="inputbreakfast">\n' +
        '                            <option value="1">Yes at extra coast</option>\n' +
        '                            <option value="1">Yes Inclusive of the bills</option>\n' +
        '                            <option value="1" selected>No</option>\n' +
        '                        </select>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-md-8">\n' +
        '                        <label for="inputdescription">Description</label>\n' +
        '                        <textarea name="description" class="form-control" id="inputdescription" maxlength="150">\n' +
        '                        </textarea>\n' +
        '                    </div>\n' +
        '                </div>';

    var apartmenthtml = ' <div class="form-row">\n' +
        '                    <div class="form-group col-md-3">\n' +
        '                        <label for="inputbedroom">Bedroom+1</label>\n' +
        '                        <select class="form-control" id="inputbedroom" name="bedroom">\n' +
        '                            <option value="0">Bedsiter</option>\n' +
        '                            <option value="1" selected>one</option>\n' +
        '                            <option value="1">two</option>\n' +
        '                            <option value="1">three</option>\n' +
        '                            <option value="1">four</option>\n' +
        '                            <option value="1">five</option>\n' +
        '                        </select>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-md-3">\n' +
        '                        <label for="inputbathroom">Bathroom</label>\n' +
        '                        <select name="bathroom" class="form-control" id="inputbathroom">\n' +
        '                            <option value="0">0</option>\n' +
        '                            <option value="1" selected>one</option>\n' +
        '                            <option value="1">two</option>\n' +
        '                            <option value="1">three</option>\n' +
        '                        </select>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-md-3">\n' +
        '                        <label for="inputfurnished">Furnished</label>\n' +
        '                        <select name="furnished" class="form-control" id="inputfurnished">\n' +
        '                            <option value="0">No</option>\n' +
        '                            <option value="1">Yes</option>\n' +
        '                        </select>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-md-3">\n' +
        '                        <label for="inputparking">Parking</label>\n' +
        '                        <select name="parking" class="form-control" id="inputparking">\n' +
        '                            <option value="0">Not Vailable</option>\n' +
        '                            <option value="1">Available</option>\n' +
        '                        </select>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-md-3">\n' +
        '                        <label for="inputwater">Water</label>\n' +
        '                        <select name="water" class="form-control" id="inputwater">\n' +
        '                            <option value="0">Not Vailable</option>\n' +
        '                            <option value="1">Borehole</option>\n' +
        '                            <option value="1">City council</option>\n' +
        '                        </select>\n' +
        '                    </div>\n' +
        '                   <div class="form-group col-md-2">\n' +
        '                        <label for="inputfloor">Floor</label>\n' +
        '                        <select name="floor" class="form-control" id="inputfloor">\n' +
        '                            <option value="0">ground</option>\n' +
        '                            <option value="1">First</option>\n' +
        '                            <option value="1">Second</option>\n' +
        '                            <option value="1">Third</option>\n' +
        '                            <option value="1">Fourth</option>\n' +
        '                            <option value="1">Fifth</option>\n' +
        '                        </select>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-md-7">\n' +
        '                        <label for="inputdescription">Description</label>\n' +
        '                        <textarea name="description" class="form-control" id="inputdescription"></textarea>\n' +
        '                    </div>\n' +
        '                </div>';
    var cottagehtml =' <div class="form-row">\n' +
        '                    <div class="form-group col-md-3">\n' +
        '                        <label for="inputbedroom">Bedrooms</label>\n' +
        '                        <select class="form-control" id="inputbedroom" name="bedroom">\n' +
        '                            <option value="1" selected>one</option>\n' +
        '                            <option value="1">two</option>\n' +
        '                            <option value="1">three</option>\n' +
        '                            <option value="1">four</option>\n' +
        '                            <option value="1">five</option>\n' +
        '                        </select>\n' +
        '                    </div>\n' +
        '                   <div class="form-group col-md-2">\n' +
        '                        <label for="swimming_pool">Swimming pool available</label>\n' +
        '                        <select name="swimming_pool" class="form-control" id="swimming_pool">\n' +
        '                            <option value="Yes">Yes</option>\n' +
        '                            <option value="No">No</option>\n' +
        '                        </select>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-md-7">\n' +
        '                        <label for="inputdescription">Description</label>\n' +
        '                        <textarea name="description" maxlength="150" class="form-control" id="inputdescription"></textarea>\n' +
        '                    </div>\n' +
        '                </div>';

    var househtml = ' <div class="form-row">\n' +
        '                    <div class="form-group col-md-4">\n' +
        '                        <label for="inputbedroom">Bedroom+1</label>\n' +
        '                        <select name="bedroom" class="form-control" id="inputbedroom">\n' +
        '                            <option value="0">Bedsiter</option>\n' +
        '                            <option value="1" selected>one</option>\n' +
        '                            <option value="1">two</option>\n' +
        '                            <option value="1">three</option>\n' +
        '                            <option value="1">four</option>\n' +
        '                            <option value="1">five</option>\n' +
        '                        </select>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-md-4">\n' +
        '                        <label for="input_servant">Servant quarter</label>\n' +
        '                        <select name="servant_quarter" class="form-control" id="input_servant">\n' +
        '                            <option value="0">Available</option>\n' +
        '                            <option value="1">Not available</option>\n' +
        '                        </select>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-md-4">\n' +
        '                        <label for="input_compound_size">Compound size</label>\n' +
        '                        <input name="compound_size" type="text" class="form-control" id="input_compound_size" placeholder="compound size"/>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-md-8">\n' +
        '                        <label for="input_description">Description</label>\n' +
        '                        <textarea name="description" class="form-control" id="input_description" maxlength="150"></textarea>\n' +
        '                    </div>\n' +
        '                </div>';
    var workspacehtml = '<div class="form-row">\n' +
        '                    <div class="form-group col-md-4">\n' +
        '                        <label for="input_workspace">Work space type</label>\n' +
        '                        <select name="workspace_type" class="form-control" id="input_workspace">\n' +
        '                            <option value="0">Shop</option>\n' +
        '                            <option>Office</option>\n' +
        '                            <option>Go down</option>\n' +
        '                        </select>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-md-4">\n' +
        '                        <label for="input_workspace_floor">Work space floor</label>\n' +
        '                        <select name="floor" class="form-control" id="input_workspace_floor">\n' +
        '                            <option selected>Ground</option>\n' +
        '                            <option>First</option>\n' +
        '                            <option>Second</option>\n' +
        '                            <option>Third</option>\n' +
        '                            <option>Fourth</option>\n' +
        '                            <option>Fifth</option>\n' +
        '                        </select>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-md-4">\n' +
        '                        <label for="input_workspace_size">Work space size</label>\n' +
        '                        <input name="workspace_size" type="text" class="form-control" id="input_workspace_size" placeholder="enter size in square metres">\n' +
        '                        </input>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-md-8">\n' +
        '                        <label for="input_description">Description</label>\n' +
        '                        <textarea name="description"  class="form-control" id="input_description" maxlength="150"></textarea>\n' +
        '                    </div>\n' +
        '                </div>';

    switchoptions($("#property :selected").val());
    $("#property").change(function () {
        switchoptions($("#property :selected").val());
    });

    function switchoptions(swichcase) {
        switch (swichcase) {
            case "Apartment":
                setoptions(apartmenthtml);
                break;
            case "Hotel":
                setoptions(hotelhtml);
                break;
            case "Land":
                setoptions(landhtml);
                break;
            case "House":
                setoptions(househtml);
                break;
            case "Work place":
                setoptions(workspacehtml);
                break;
            case "Cottage":
                console.log("am selected");
                setoptions(cottagehtml);
                break;
            default:
                setoptions("");
        }
    }

    $("#sale_radio").click(function () {
        if ($(this).is(':checked')) {
            $("#paymentmode").css("display", "none");
        }
    });
    $("#rent_radio").click(function () {
        if ($(this).is(':checked')) {
            $("#paymentmode").css("display", "block");
        }
    });

    function setoptions(html) {
        $("#options-holder").html(html);
    }

    $("#inputimages").on("click", function () {
        $(this).value = "";
        $("#imagecanvas").html("");
    });
    imageupload();
});

function imageupload() {
    if (window.File && window.FileList && window.FileReader) {
        var filesInput = document.getElementById('inputimages');
        filesInput.addEventListener('change', function (event) {
            var files = event.target.files; //FileList object
            // this.form.reset();
            var output = document.getElementById('imagecanvas');
            if (files.length < 3) {
                for (var i = 0; i < files.length; i++) {

                    var file = files[i];
                    if (file.type.match('image')) {
                        var picReader = new FileReader();
                        picReader.addEventListener('load', function (event) {
                            var picFile = event.target;
                            var img = document.createElement('img');
                            img.src = picFile.result;
                            img.classList.add("card-img-top");
                            img.classList.add("small-uploaded-img");

                            output.insertBefore(img, null);
                        });
                        picReader.readAsDataURL(file);
                    }

                }
            }else{
                this.form.reset();
                var danger ='<div class="alert alert-danger" role="alert">\n' +
                    ' You cannot upload more that 3 photos!\n' +
                    '</div>';
                output.innerHTML = danger;
            }
        });
    }
}


