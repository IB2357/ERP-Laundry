import frappe
from frappe.utils import nowdate

def order_Late_status():
    orders = frappe.get_all('Order', filters={'delivery_date': ['<', nowdate()], 'status': 'Ready'}, fields=['name'])
    
    for order in orders:
        print(order.name)
        frappe.db.set_value('Order', order.name, 'status', 'Late')

    print('\n\n\n\n\n\n daily task done \n\n\n\n\n\n')
