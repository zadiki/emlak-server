import {addCategoryService} from "../services/CategoryService";
import {generateErrorsArray} from "../utils/ErrorsUtil";
import {toUpperCase} from "../utils/StringManupulation";


export const addCategory = (req, res, next) => {
    let category = {};
    addCategoryService(req.body)
        .then((category) => {
            res.json(category);
        }).catch((errors) => {
        let errors_array = generateErrorsArray(errors.errors);
        res.json(errors_array)
    });

}


export const addCategoryType = (req, res, next) => {
    let categorytype = {
        Name: toUpperCase(req.body.Name.trim())
    };
    addCategoryService(categorytype)
        .then((categorytype) => {
            res.json({});
        }).catch((errors) => {
        let errors_array = generateErrorsArray(errors.errors);
        res.status(401),json(errors_array);

    });
}

