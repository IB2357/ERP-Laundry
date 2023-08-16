
let user_roles = frappe.user_roles;
let refresh;
let selected_items ;
let block_devider = true;
let doc_name;

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

// frappe.listview_settings['Order'] = {
//     onload: function(listview) {
//         // Add a custom button to the List View
//         // refresh = listview.page.add_inner_button(__('Add Instructions To The Last Order'), function() {
//         //     listview.refresh();
//         // });

//     }

// }


    // refreshing & last order Instructions Block
frappe.listview_settings['Order'] = {
    refresh: function(listview) {
        listview.refresh();
        refresh = function(){ 
            listview.refresh();
            // setTimeout(function() { 
            //     show_alert("White . . .",1);     
            //   }, 100);
            listview.refresh();
        }
        
        
        // console.log(frappe.db.get_value('Order','ACC-SINV-2023-00075','name'))

        // last order Instructions
        listview.page.add_inner_button(__('Add Instructions To The Last Order'), function() {
            // frappe.new_doc('Order Instructions', {
            //     // 'fieldname': 'fieldvalue', // Set any default values you want for the new document
            // }, (doc) => {
            //     // This callback function will be executed after the new document is created
            //     frappe.show_alert(__('Order Instructions created successfully!'), 5); // Show a success message
            //     // You can perform additional actions or update the Kanban List View here if needed
            // });
            // frappe.prompt([
            //     {'fieldname': 'birth', 'fieldtype': 'Text Editor', 'label': 'Birth Date', 'reqd': 1}
            // ],
            // function(values){
            //     show_alert(values, 5);
            // },
            // 'Age verification',
            // 'Subscribe me'
            // )

            frappe.prompt(
                [
                
                  {
                    fieldtype: 'Text Editor',
                    label: 'Add Instructions',
                    fieldname: 'instructions',
                    reqd: 1, 
                  },
                  {
                    fieldtype: 'Link',
                    label: 'Order',
                    fieldname: 'order',
                    options:'Order',
                    description:'*If you lift this field empty, the last Order created will be fetched ',
                    reqd: 0, 
                },
                ],
                function(values) {
                  console.log(values.order);
              
                  frappe.call({
                    
                    method: 'laundry.laundry.doctype.order.order_controls.update_last_instructions', // Replace with your server-side function
                    args: {
                        instructions_value: values.instructions,
                      order_value: values.order
                    },
                    callback: function(response) {
                      if (response && response.message === 'success') {
                        show_alert(__('Instructions Added successfully.'));
                      } else {
                        frappe.msgprint(__('Failed to update Instructions.'));
                      }
                    },
                  });
                },
                'Order Instructions',
                'Add'
              );
              
              
            
        });
        // Actions
        // listview.page.add_inner_button(__('Custom Button'), function() {
        //     selected_items = listview.get_checked_items;
        //     console.log(selected_items());
        // }, __('Actions'));

        // listview.page.add_menu_item(__('Custom Button1'), function() {
        //     // Define the action to be performed when the custom button is clicked
        //     // For example, you can open a new page or perform a specific action
        //     // when the custom button is clicked for a particular row.
        //     frappe.msgprint('Custom button clicked!');
        // });
    },

//     // button: {
//     //     show(doc) {
//     //         return doc.reference_name;
//     //     },
//     //     get_label() {
//     //         return 'View';
//     //     },
//     //     get_description(doc) {
//     //         return __('View {0}', [`${doc.reference_type} ${doc.reference_name}`])
//     //     },
//     //     action(doc) {
//     //         frappe.set_route('Form', doc.reference_type, doc.reference_name);
//     //     }
//     // }
};

// frappe.listview_settings['Order'].button = {
//     show(doc) {
//         return doc.status == 'Received';
//     },
//     get_label() {
//         return __('add Instructions');
//     },
//     get_description(doc) {
//         return __('add Instructions to this Order')
//     },
//     action(doc) {
//         frappe.new_doc('Order Instructions', {
//             'order':doc.name
//         });
//         // frappe.call({
//         //     method: 'membership.api.make_payment_for_invoice',
//         //     args: {
//         //         invoice_name: doc.name,
//         //     },
//         //     callback: (r) => {
                
//         //         if(r.exc) frappe.throw('Error creating payment');
                
//         //         frappe.set_route('Form', 'Payment Entry', r.message.payment);
                
//         //     }
//         // });
//     }
// }
frappe.listview_settings['Order'].button = {
    show(doc) {
        if (['Received','Under Processing','Ready','Late'].includes(doc.status))
        // if (['Received','Under Processing'].includes(doc.status))
            return true;
    },
    get_label(doc) {
        
        switch (doc.status) {
            case 'Received':
                return 'Start Processing';

            case 'Under Processing':
                return 'Make Ready';

            case 'Ready':
                return 'Pay & Deliver';

            case 'Late':
                return 'Pay & Deliver';
    

            default:
                return 'No Actions'
        }
    },
    get_description(doc) {
        return __('Workflow Action')
    },
    action(doc) {
        console.log(doc.oa)

        if (doc_name && doc_name != doc.name)
            block_devider = true;
        // Actions
        if (block_devider){

            function check_SR(status,role){
                let res = false
                let user_roles = frappe.user_roles;
                if (status.includes(doc.status)&& 
                user_roles.includes(role)){res = true}
                console.log(doc.status)
                console.log(status)
                return res;
            }

            if (check_SR(actions.Start_Processing.status,actions.Start_Processing.role)){
                frappe.db.set_value('Order',doc.name,'status','Under Processing')
            }
    
            else if (check_SR(actions.Make_Ready.status,actions.Make_Ready.role)){
                frappe.db.set_value('Order',doc.name,'status','Ready')
            }
    
            else if (check_SR(actions.Make_Delivery.status,actions.Make_Delivery.role)){
                // frappe.db.set_value('Order',doc.name,'status','Delivered')           
                frappe.set_route('Form', 'Order', doc.name);
                setTimeout(function() {
                    // Find the custom button element by its value and trigger a click event
                    var buttons = document.querySelectorAll('.btn[data-label="Pay%20%26%20Deliver"]');
                    if (buttons.length > 0) {
                      buttons[0].click();
                    }
                  }, 500);
                // setTimeout(function() {
                //     // Find the custom button element by class name and trigger a click event
                //     var customButton = document.querySelector('.btn-xs');
                //     if (customButton) {
                //       customButton.click();
                //     }
                //   }, 5000);
                // 
            }
    
            else{
                frappe.msgprint("You Don't Have Permissions!",'Erorr');
            } 
            
            

            show_alert("Click Agien To Refrish Orders List");
            block_devider = false;
            console.log('part 1')
        }
        else{
            block_devider = true;
            show_alert(`${doc.name}'s Status Is '${doc.status}' Now`);
            console.log('part 2')
        refresh();
        }

        console.log('part all')
        doc_name = doc.name;


        // show_alert(`Order's Status Is ${doc.status} Now`);



        





        // if (doc.status=='Received'){
        //     frappe.db.set_value('Order',doc.name,'status','Ready')
           
           
           
            // if (btn) {
            //     btn();
            //     btn();     
            // }
            // frappe.set_route('List', 'Order');
            // frappe.ui.toolbar.clear_cache();
            // 
    }

           
        // frappe.call({
        //     method: 'membership.api.make_payment_for_invoice',
        //     args: {
        //         invoice_name: doc.name,
        //     },
        //     callback: (r) => {
                
        //         if(r.exc) frappe.throw('Error creating payment');
                
        //         frappe.set_route('Form', 'Payment Entry', r.message.payment);
                
        //     }
        // });
}

