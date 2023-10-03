let user_roles = frappe.user_roles;
let refresh;
let selected_items;
let block_devider = true;
let doc_name;

const actions = {
    // cuting Start_Processing action
    // Start_Processing: {
    // 	status: 'Received',
    // 	role: 'System Manager'
    // },
    // Make_Ready: {
    // 	status: 'Under Processing',
    // 	role: 'System Manager'
    // },
    Make_Ready: {
        status: 'Received',
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

// refreshing & last order Instructions Block
frappe.listview_settings['Order'] = {
    refresh: function (listview) {

        // refreshing
        listview.refresh();
        refresh = function () {
            listview.refresh();
            // setTimeout(function() { 
            //     show_alert("White . . .",1);     
            //   }, 100);
            listview.refresh();
        }

        // last order Instructions
        listview.page.add_inner_button(__('Add Instructions To The Last Order'), function () {
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
                        options: 'Order',
                        description: '*If you lift this field empty, the last Order created will be fetched ',
                        reqd: 0,
                    },
                ],
                function (values) {
                    frappe.call({
                        method: 'laundry.laundry.doctype.order.order_controls.update_last_instructions', // Replace with your server-side function
                        args: {
                            instructions_value: values.instructions,
                            order_value: values.order
                        },
                        callback: function (response) {
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
    },
};

// Workflow actions button
frappe.listview_settings['Order'].button = {
    show(doc) {
        if (['Received', 'Under Processing', 'Ready', 'Late'].includes(doc.status))
            return true;
    },
    get_label(doc) {
        switch (doc.status) {
            // cuting Start_Processing action
            // case 'Received':
            //     return 'Start Processing';
            case 'Received':
                return 'Make Ready';

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
        if (doc_name && doc_name != doc.name)
            block_devider = true;
        // Actions
        if (block_devider) {
            function check_SR(status, role) {
                let res = false
                let user_roles = frappe.user_roles;
                if (status.includes(doc.status) &&
                    user_roles.includes(role)) { res = true }
                console.log(doc.status)
                console.log(status)
                return res;
            }

            // cuting Start_Processing action
            // if (check_SR(actions.Start_Processing.status, actions.Start_Processing.role)) {
            //     frappe.db.set_value('Order', doc.name, 'status', 'Under Processing')
            // }

            if (check_SR(actions.Make_Ready.status, actions.Make_Ready.role)) {
                frappe.db.set_value('Order', doc.name, 'status', 'Ready')
            }

            else if (check_SR(actions.Make_Delivery.status, actions.Make_Delivery.role)) {
                // frappe.db.set_value('Order',doc.name,'status','Delivered')           
                frappe.set_route('Form', 'Order', doc.name);
                setTimeout(function () {
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
            else {
                frappe.msgprint("You Don't Have Permissions!", 'Erorr');
            }
            show_alert("Click Agien To Refrish Orders List");
            block_devider = false;
            // console.log('part 1') //for Debugging, Dont Delete
        }
        else {
            block_devider = true;
            show_alert(`${doc.name}'s Status Is '${doc.status}' Now`);
            // console.log('part 2') //for Debugging, Dont Delete
            refresh();
        }
        // console.log('part all') //for Debugging, Dont Delete
        doc_name = doc.name;
        // show_alert(`Order's Status Is ${doc.status} Now`);
    }
}