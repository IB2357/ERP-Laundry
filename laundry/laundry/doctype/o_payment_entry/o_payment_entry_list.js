frappe.listview_settings['Order'] = {
    refresh: function(listview) {
        frappe.msgprint("ji")
    }};

frappe.listview_settings['Order'].button = {
    show(doc) {
        // if (['Received','Under Processing','Ready','Late'].includes(doc.status))
        // return true;
    },
    get_label(doc) {
      
            return 'No Actions';
        
    },
    get_description(doc) {
        return __('Workflow Action')
    },
    action(doc) {
        console.log(doc.outstanding_amount);
    }
}
