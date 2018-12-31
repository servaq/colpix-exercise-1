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

	async get(api, req) {
		const id = req.pathParams.id;
		const item = await EmployeeDao.get(id);
		item.employees_supervised = await EmployeeDao.getCountForSupervisor(id);
		return await ApiBuilderHelper.createResponse(api, item || {}, {}, 200);
	}

	async getListForSupervisor(api, req) {
		const id = req.pathParams.id;
		const list = await EmployeeDao.getForSupervisor(id);
		const body = {
			items: list,
			total_items: list.length,
		}
		return await ApiBuilderHelper.createResponse(api, body, {}, 200);
	}

}

module.exports = new EmployeeController();