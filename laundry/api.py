import frappe
# from frappe import __


def create_order_for_invoice(doc,method):
    """Create an Order when A Sales Invoice Submited"""
    try:
        order = frappe.get_doc({
        'doctype':'Order',
        'status':'Received',
        'invoice':doc.name,
        'order_instructions':doc.posa_notes
        })	
        order.insert(ignore_permissions = True)
    except :
        frappe.throw("Error In Order Creation.")