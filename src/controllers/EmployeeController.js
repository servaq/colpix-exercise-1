const EmployeeDao = require('../daos/EmployeeDao');
const ApiBuilderHelper = require('../helpers/ApiBuilderHelper');

class EmployeeController {

	async getList(api, req) {
		const list = await EmployeeDao.getAll();
		const body = {
			items: list,
			total_items: list.length,
		}
		return await ApiBuilderHelper.createResponse(api, body);
	}

	async get(api, req, id) {
		if (!id) {
			id = req.pathParams.id;
		}
		const item = await EmployeeDao.get(id);
		item.employees_supervised = await EmployeeDao.getCountForSupervisor(id);
		return await ApiBuilderHelper.createResponse(api, item);
	}

	async getListForSupervisor(api, req) {
		const id = req.pathParams.id;
		const list = await EmployeeDao.getForSupervisor(id);
		const body = {
			items: list,
			total_items: list.length,
		}
		return await ApiBuilderHelper.createResponse(api, body);
	}

	async _getValidatedItem(req) {
		const item = {
			name: req.body.name || null,
			email: req.body.email || null,
			supervisor_id: req.body.supervisor_id || null,
		}
		if (item.name == null || item.name == '') {
			throw new Error('Invalid name');
		}
		if (item.email == null || item.email == '') {
			throw new Error('Invalid email');
		}
		if (item.supervisor_id != null) {
			const supervisor = await EmployeeDao.get(item.supervisor_id);
			if (supervisor == null) {
				throw new Error('Invalid supervisor');
			}
		}
		return item;
	}

	async post(api, req) {
		let item;
		try {
			item = await this._getValidatedItem(req);
		} catch (error) {
			const body = {
				message: error.message,
			}
			throw await ApiBuilderHelper.createResponse(api, body, 400);
		}
		const id = await EmployeeDao.save(item);
		item = await EmployeeDao.get(id[0]);
		item.employees_supervised = await EmployeeDao.getCountForSupervisor(id[0]);
		return await ApiBuilderHelper.createResponse(api, item, 201);
	}

	async put(api, req) {
		let id = req.pathParams.id;
		let item = await EmployeeDao.get(id);
		if (item == null) {
			const body = {
				message: 'Invalid item ID',
			}
			throw await ApiBuilderHelper.createResponse(api, body, 404);
		}
		try {
			const item2 = await this._getValidatedItem(req);
			item.name = item2.name;
			item.email = item2.email;
			item.supervisor_id = item2.supervisor_id;
		} catch (error) {
			const body = {
				message: error.message,
			}
			throw await ApiBuilderHelper.createResponse(api, body, 400);
		}
		id = await EmployeeDao.save(item);
		item = await EmployeeDao.get(item.id);
		item.employees_supervised = await EmployeeDao.getCountForSupervisor(item.id);
		return await ApiBuilderHelper.createResponse(api, item, 200);
	}

	async delete(api, req) {
		const id = req.pathParams.id;
		const item = await EmployeeDao.get(id);
		if (item == null) {
			const body = {
				message: 'Invalid item ID',
			}
			throw await ApiBuilderHelper.createResponse(api, body, 404);
		}
		const employeesSupervised = await EmployeeDao.getCountForSupervisor(id);
		if (employeesSupervised > 0) {
			const body = {
				message: 'Has supervised employees',
			}
			throw await ApiBuilderHelper.createResponse(api, body, 400);
		}
		await EmployeeDao.delete(id);
		return await ApiBuilderHelper.createResponse(api, {}, 204);
	}

}

module.exports = new EmployeeController();