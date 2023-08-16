// Copyright (c) 2023, Ibrahim Sultan Al-Wajih and contributors
// For license information, please see license.txt

frappe.ui.form.on('O Payment Entry', {
	refresh: function(frm) {

		frm.refresh_field('outstanding_amount')
		frm.refresh_field('invoice')

		frm.add_custom_button(__('buttonName'), function(){
			frappe.msgprint("TEST")
		  }, __('groupName'));

	  frm.add_custom_button(__('Make Payment'), function() {
		if (frm.doc.invoice) {
		  frappe.call({
			method: 'laundry.laundry.doctype.o_payment_entry.o_payment_entry_controls.create_payment_entry',
			args: {
			  ope: frm.doc.name,
			},
			callback: function(response) {
			  if (response && response.message) {
				frappe.msgprint(__('Payment entry created successfully.'));
				frm.reload_doc();
			  } else {
				frappe.msgprint(__('Failed to create payment entry.'));
			  }
			},
		  });
		} else {
		  frappe.msgprint(__('Please select a Sale Invoice.'));
		}
	  });
	},
  });
  
//   frappe.ui.form.on('O Payment Entry', {
// 	refresh: function(frm) {
// 	  // Add the custom button to the toolbar
// 	  frm.page.add_menu_item(__('Add Row to Field 3'), function() {
// 		openPrompt(frm);
// 	  });
// 	}
//   });
  
//   function openPrompt(frm) {
// 	// Show the prompt with the fields
// 	frappe.prompt([
// 	  {
// 		fieldtype: 'Date',
// 		label: 'Field 1',
// 		fieldname: 'field1_input',
// 	  },
// 	  {
// 		fieldtype: 'Date',
// 		label: 'Field 2',
// 		fieldname: 'field2_input',
// 	  },
// 	  {
// 		"fieldname": "references",
// 		"fieldtype": "Table",
// 		"label": "Payment References",
// 		"options": "Payment Entry Reference",
// 		'fields': [
// 			{
// 				fieldtype: 'Link',
// 				label: 'Type',
// 				fieldname: 'reference_doctype',
// 				"options": 'DocType',
// 				reqd: 1,
// 			  },
// 			{
// 			  fieldtype: 'Dynamic Link',
// 			  label: 'Name',
// 			  fieldname: 'reference_name',
// 			  "options": 'reference_doctype',
// 			  reqd: 1,
// 			},
// 			{
// 			  fieldtype: 'float',
// 			  label: 'Allocated',
// 			  fieldname: 'allocated_amount',
// 			},
// 		  ],
// 	   },
// 	], function(values) {
// 	  // Create a new row in the table field and set the values from the prompt
// 	//   var row = frm.add_child('field3_table');
// 	//   row.date_field = values.field1_input;
// 	//   row.other_field = values.field2_input;
// 		frm.doc.references = values.references
// 	  // Refresh the table field to show the new row
// 	  frm.refresh_field('field3_table');
// 	}, __('Enter Values for Field 1, Field 2, and Table Field'));
//   }
  
  
