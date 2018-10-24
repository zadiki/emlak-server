import {addCategoryService} from "../services/CategoryService";
import {generateErrorsArray} from "../utils/ErrorsUtil";
import {toUpperCase} from "../utils/StringManupulation";


export const addCategory = (req, res, next) => {
    let category = {};
    addCategoryService(req.body)
        .then((category) => {
            res.send(category);
        }).catch((errors) => {
        let errors_array = generateErrorsArray(errors.errors);
        req.flash("errors", errors_array);
        res.send(errors_array)
        // res.redirect('back');
    });

}


export const addCategoryType = (req, res, next) => {
    let categorytype = {
        Name: toUpperCase(req.body.Name.trim())
    };
    addCategoryService(categorytype)
        .then((categorytype) => {
            res.redirect('back');
        }).catch((errors) => {
        let errors_array = generateErrorsArray(errors.errors);
        req.flash("errors", errors_array);
        res.redirect('back');
    });
}

