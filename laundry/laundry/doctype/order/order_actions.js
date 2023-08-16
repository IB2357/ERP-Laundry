let user_roles = frappe.user_roles;

const actions = {
	Start_Processing:{
		status:'Received',
		role:'System Manager'
	},
	Make_Ready:{
		status:'Under Processing',
		role:'System Manager'
	},
	Make_Delivery:{
		status:['Ready','Late'],
		role:'All'
	},
	AnnouncingـFailure:{
		status:['Under Processing','Received'],
		role:'All'
	},
	Give_Compensation:{
		status:'Failed',
		role:'All'
	},
	Give_Refunds:{
		status:'Failed',
		role:'All'
	},
}; 