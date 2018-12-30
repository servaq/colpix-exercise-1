const EmployeeDao = require('../daos/EmployeeDao');
const ApiBuilderHelper = require('../helpers/ApiBuilderHelper');

class EmployeeController {

	async getList(api, req) {
		const list = await EmployeeDao.getAll();
		const body = {
			items: list,
			total_items: list.length,
		}
		return await ApiBuilderHelper.createResponse(api, body, {}, 200);
	}

}

module.exports = new EmployeeController();