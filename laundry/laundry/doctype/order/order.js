// Copyright (c) 2023, Ibrahim Sultan Al-Wajih and contributors
// For license information, please see license.txt


//  frm.save();
// frm.set_intro('Please set the value of description', 'blue');

frappe.ui.form.on('Order', {

	onload(frm) {

		// frm.set_value('oa',frm.doc.outstanding_amount)
		// // frm.set_value('outstanding_amount',frm.doc.outstanding_amount)
		// frm.save()


		frm.disable_save();
	},

	refresh(frm) {
		// frm.set_value('oa',frm.doc.outstanding_amount)
		// // frm.set_value('outstanding_amount',frm.doc.outstanding_amount)
		// frm.save()

		let user_roles = frappe.user_roles;
		const actions = {
			Start_Processing: {
				status: 'Received',
				role: 'System Manager'
			},
			Make_Ready: {
				status: 'Under Processing',
				role: 'System Manager'
			},
			Make_Delivery: {
				status: ['Ready', 'Late'],
				role: 'All'
			},
			AnnouncingـFailure: {
				status: ['Under Processing', 'Received'],
				role: 'All'
			},
			Give_Compensation: {
				status: 'Failed',
				role: 'All'
			},
			Give_Refunds: {
				status: 'Failed',
				role: 'All'
			},
		};
		// frm.doc.status = 'Under Processing';

		function check_SR(status, role) {
			let res = false
			let user_roles = frappe.user_roles;
			if (status.includes(frm.doc.status) &&
				user_roles.includes(role)) { res = true }
			return res;
		}

		if (check_SR(actions.Start_Processing.status, actions.Start_Processing.role)) {
			frm.add_custom_button(__('Start Processing'), function () {

				frm.set_value('status', 'Under Processing')
				frm.save();
				show_alert(`Order's Status Is ${frm.doc.status} Now`);
			}, __('Actions'))
		}
		if (check_SR(actions.Make_Ready.status, actions.Make_Ready.role)) {
			frm.add_custom_button(__('Make Ready'), function () {

				frm.set_value('status', 'Ready')
				frm.save();
				show_alert(`Order's Status Is ${frm.doc.status} Now`);
			}, __('Actions'))
		}


		if (check_SR(actions.AnnouncingـFailure.status, actions.AnnouncingـFailure.role)) {
			frm.add_custom_button(__('Announcing Failure'), function () {

				frm.set_value('status', 'Failed')
				frm.save();
				show_alert(`Order's Status Is ${frm.doc.status} Now`);
			}, __('Actions'))
		}


		if (check_SR(actions.Give_Compensation.status, actions.Give_Compensation.role)) {
			frm.add_custom_button(__('Give Compensation'), function () {

				frm.set_value('status', 'Compensation Done')
				frm.save();
				show_alert(`Order's Status Is ${frm.doc.status} Now`);
			}, __('Actions'))
		}


		if (check_SR(actions.Give_Refunds.status, actions.Give_Refunds.role)) {
			frm.add_custom_button(__('Give Refunds'), function () {

				frm.set_value('status', 'Refunded')
				frm.save();
				show_alert(`Order's Status Is ${frm.doc.status} Now`);
			}, __('Actions'))
		}
		// frm.add_custom_button(
		// 	__('Payment1'),
		// 	() => invoice.make_payment_entry(),
		// 	__('Create')
		// );
		// frm.add_custom_button(__('payment'), function(){
		// 	let invoice = frappe.get_doc('Sales Invoice', frm.doc.invoice)
		// 	// frappe.msgprint()
		// 	invoice.make_payment_entry()


		// })

		//actions[key].status.includes(frm.doc.status)
		// Object.keys(actions).forEach((key) => {
		// 	// console.log(`${key}, ${actions[key].role}, ${actions[key].status}`);
		// 	if (!( actions[key].status == frm.doc.status   && user_roles.includes(actions[key].role) )){

		// 	}
		// 	else{
		// 		removed_btns.push(frm.remove_custom_button(key, 'Actions'));

		// 		console.log(`${key}, ${actions[key].role}, ${actions[key].status}`);
		// 		console.log(frm.doc.status);
		// 	}
		// 	console.log(removed_btns)

		// });
		if (check_SR(actions.Make_Delivery.status, actions.Make_Delivery.role)) {
			frm.add_custom_button(__('Pay & Deliver'), function () {
				if (frm.doc.outstanding_amount > 0) {
					frappe.prompt(
						[
							{

								// "fetch_from": "order.customer",
								"default": frm.doc.customer,
								"fieldname": "customer",
								"fieldtype": "Link",
								"label": "Customer",
								"options": "Customer",
							},
							{
								"fieldname": "column_break_1",
								"fieldtype": "Column Break"
							},
							{
								"default": frm.doc.name,
								"fieldname": "order",
								"fieldtype": "Link",
								"label": "Order ",
								"options": "Order",
								"read_only": 1
							},
							{
								"fieldname": "section_break_1",
								"fieldtype": "Section Break"
							},
							{
								"default": frm.doc.outstanding_amount,
								"fieldname": "amount",
								"fieldtype": "Currency",
								"label": "Paid Amount",
								"options": "paid_from_account_currency"
							},
							{
								// "fetch_from": "invoice.outstanding_amount",
								// "default": 'amount',
								"default": frm.doc.outstanding_amount,
								"fieldname": "outstanding_amount",
								"fieldtype": "Currency",
								"label": "Outstanding Amount",
								"description": "'Outstanding Amount' intel this 'Payment'"
								// "read_only": 1
							},
							{
								"fieldname": "column_break_2",
								"fieldtype": "Column Break"
							},
							{
								"default": "Cash",
								"fieldname": "mode_of_payment",
								"fieldtype": "Link",
								"label": "Mode of Payment",
								"options": "Mode of Payment"
							},
							{
								"default": frm.doc.invoice,
								// "fetch_from": "order.invoice",
								"fieldname": "invoice",
								"fieldtype": "Link",
								// "hidden": 1,
								"label": "Invoice",
								"options": "Sales Invoice"
							},
							{
								"fieldname": "more",
								"fieldtype": "Fold",
								"label": "More"
							},
							{
								"fieldname": "section_break_2",
								"fieldtype": "Section Break"
							},
							{
								"default": "1310 - Debtors - BI",
								"fieldname": "paid_from",
								"fieldtype": "Link",
								"label": "Account Paid From",
								"options": "Account"
							},
							{
								"default": 'YER',
								"fieldname": "paid_from_account_currency",
								"fieldtype": "Link",
								"label": "Account Currency (From)",
								"options": "Currency"
							},
							{
								"default": "1110 - Cash - BI",
								"fieldname": "paid_to",
								"fieldtype": "Link",
								"label": "Account Paid To",
								"options": "Account"
							},
							{
								"default": 'YER',
								"fieldname": "paid_to_account_currency",
								"fieldtype": "Link",
								"label": "Account Currency (To)",
								"options": "Currency"
							},
							{
								"fieldname": "column_break_3",
								"fieldtype": "Column Break"
							},
							{
								"fieldname": "received_amount",
								"fieldtype": "Currency",
								"label": "Received Amount",
								"description": "'Received Amount' equals 'Paid amount' by default "
							},
							{
								"default": "1",
								"fieldname": "source_exchange_rate",
								"fieldtype": "Float",
								"label": "Source Exchange Rate"
							},

							{
								"default": "1",
								"fieldname": "target_exchange_rate",
								"fieldtype": "Float",
								"label": "Target Exchange Rate"
							},
						],
						function (values) {

							frappe.call({
								method: 'laundry.laundry.doctype.order.order_controls.create_payment_entry',
								args: {
									order: values.order,
									customer: values.customer,
									invoice: values.invoice,
									amount: values.amount,
									mode_of_payment: values.mode_of_payment,
									received_amount: values.received_amount,
									target_exchange_rate: values.target_exchange_rate,
									source_exchange_rate: values.source_exchange_rate,
									paid_to: values.paid_to,
									paid_to_account_currency: values.paid_to_account_currency,
									paid_from: values.paid_from,
									paid_from_account_currency: values.paid_from_account_currency,
									outstanding_amount: values.outstanding_amount,

									// doc: frm.doc.name,
								},
								callback: function (response) {
									if (response && response.message) {
										show_alert(__('Payment entry created successfully.'));
										frm.reload_doc();
									} else {
										frappe.msgprint(__('Failed to create payment entry.'));
									}
								},
							});

							frm.refresh();
							show_alert('Page Refreshed');
						},
						'Making Payment',
						'Pay'
					)
				}
				else if (frm.doc.outstanding_amount === 0){
					frappe.prompt(
						[
							{
								"fieldname": "intro",
								"fieldtype": "HTML",
								"options": "<div class=\" alert-success rounded p-3\">The remaining amounts have been paid</div>"
							},
							{
								"fieldname": "section_break_0",
								"fieldtype": "Section Break"
							},
							{
								

								// "fetch_from": "order.customer",
								"default": frm.doc.customer,
								"fieldname": "customer",
								"fieldtype": "Link",
								"label": "Customer",
								"options": "Customer",
							},
							{
								"fieldname": "column_break_1",
								"fieldtype": "Column Break"
							},
							{
								"default": frm.doc.name,
								"fieldname": "order",
								"fieldtype": "Link",
								"label": "Order ",
								"options": "Order",
								"read_only": 1
							},
							{
								"fieldname": "section_break_1",
								"fieldtype": "Section Break"
							},
							{
								"fieldname": "column_break_2",
								"fieldtype": "Column Break"
							},
							{
								"default": frm.doc.invoice,
								// "fetch_from": "order.invoice",
								"fieldname": "invoice",
								"fieldtype": "Link",
								// "hidden": 1,
								"label": "Invoice",
								"options": "Sales Invoice"
							},
							{
								"fieldname": "more",
								"fieldtype": "Fold",
								"label": "More"
							},
							{
								"fieldname": "section_break_2",
								"fieldtype": "Section Break"
							},
							
						],
						function (values) {
							frm.set_value('status', 'Delivered');
							frm.save();
							show_alert(`Order's Status Is ${frm.doc.status} Now`);
						},
						'Making Delivery',
						'Deliver'
					)
					// frm.set_value('status', 'Delivered')
					// frm.save();
					// show_alert(`Order's Status Is ${frm.doc.status} Now`);

				}
			});
		}
		if (frm.doc.outstanding_amount > 0) {
			frm.add_custom_button(__('instant Payment'), function () {
				frappe.prompt(
					[
						{

							// "fetch_from": "order.customer",
							"default": frm.doc.customer,
							"fieldname": "customer",
							"fieldtype": "Link",
							"label": "Customer",
							"options": "Customer",
						},
						{
							"fieldname": "column_break_1",
							"fieldtype": "Column Break"
						},
						{
							"default": frm.doc.name,
							"fieldname": "order",
							"fieldtype": "Link",
							"label": "Order ",
							"options": "Order",
							"read_only": 1
						},
						{
							"fieldname": "section_break_1",
							"fieldtype": "Section Break"
						},
						{
							"default": frm.doc.outstanding_amount,
							"fieldname": "amount",
							"fieldtype": "Currency",
							"label": "Paid Amount",
							"options": "paid_from_account_currency"
						},
						{
							// "fetch_from": "invoice.outstanding_amount",
							// "default": 'amount',
							"default": frm.doc.outstanding_amount,
							"fieldname": "outstanding_amount",
							"fieldtype": "Currency",
							"label": "Outstanding Amount",
							"description": "'Outstanding Amount' intel this 'Payment'"
							// "read_only": 1
						},
						{
							"fieldname": "column_break_2",
							"fieldtype": "Column Break"
						},
						{
							"default": "Cash",
							"fieldname": "mode_of_payment",
							"fieldtype": "Link",
							"label": "Mode of Payment",
							"options": "Mode of Payment"
						},
						{
							"default": frm.doc.invoice,
							// "fetch_from": "order.invoice",
							"fieldname": "invoice",
							"fieldtype": "Link",
							// "hidden": 1,
							"label": "Invoice",
							"options": "Sales Invoice"
						},
						{
							"fieldname": "more",
							"fieldtype": "Fold",
							"label": "More"
						},
						{
							"fieldname": "section_break_2",
							"fieldtype": "Section Break"
						},
						{
							"default": "1310 - Debtors - BI",
							"fieldname": "paid_from",
							"fieldtype": "Link",
							"label": "Account Paid From",
							"options": "Account"
						},
						{
							"default": 'YER',
							"fieldname": "paid_from_account_currency",
							"fieldtype": "Link",
							"label": "Account Currency (From)",
							"options": "Currency"
						},
						{
							"default": "1110 - Cash - BI",
							"fieldname": "paid_to",
							"fieldtype": "Link",
							"label": "Account Paid To",
							"options": "Account"
						},
						{
							"default": 'YER',
							"fieldname": "paid_to_account_currency",
							"fieldtype": "Link",
							"label": "Account Currency (To)",
							"options": "Currency"
						},
						{
							"fieldname": "column_break_3",
							"fieldtype": "Column Break"
						},
						{
							"fieldname": "received_amount",
							"fieldtype": "Currency",
							"label": "Received Amount",
							"description": "'Received Amount' equals 'Paid amount' by default "
						},
						{
							"default": "1",
							"fieldname": "source_exchange_rate",
							"fieldtype": "Float",
							"label": "Source Exchange Rate"
						},

						{
							"default": "1",
							"fieldname": "target_exchange_rate",
							"fieldtype": "Float",
							"label": "Target Exchange Rate"
						},
					],
					function (values) {

						frappe.call({
							method: 'laundry.laundry.doctype.order.order_controls.create_payment_entry',
							args: {
								order: values.order,
								customer: values.customer,
								invoice: values.invoice,
								amount: values.amount,
								mode_of_payment: values.mode_of_payment,
								received_amount: values.received_amount,
								target_exchange_rate: values.target_exchange_rate,
								source_exchange_rate: values.source_exchange_rate,
								paid_to: values.paid_to,
								paid_to_account_currency: values.paid_to_account_currency,
								paid_from: values.paid_from,
								paid_from_account_currency: values.paid_from_account_currency,
								outstanding_amount: values.outstanding_amount,

								// doc: frm.doc.name,
							},
							callback: function (response) {
								if (response && response.message) {
									show_alert(__('Payment entry created successfully.'));
									frm.reload_doc();
								} else {
									frappe.msgprint(__('Failed to create payment entry.'));
								}
							},
						});

						frm.refresh();
						show_alert('Page Refreshed');
					},
					'Making Payment',
					'Pay'
				)
			});
		}




	},


	// before_save: function(frm) {
	// 	if (!frm.doc.field) {
	// 		frappe.prompt({
	// 			fieldname: 'custom_value',
	// 			label: 'Enter Custom Value',
	// 			fieldtype: 'Small Text',
	// 			reqd: 1,
	// 		}, function(values) {
	// 			frm.doc.field = values.custom_value;
	// 			frm.save(); 
	// 		}, 'Submit');
	// 		frappe.validated = false;
	// 	}
	// }
});

