import frappe
# laundry.laundry.doctype.order.order_controls
# frappe.get_roles()

# @frappe.whitelist()

from frappe import _

@frappe.whitelist()
def update_last_instructions(instructions_value,order_value=None):
    try:
        if order_value:
            doc = frappe.get_doc('Order', order_value)
        else:
            doc = frappe.get_last_doc('Order')
        doc.set('order_instructions', instructions_value)
        doc.save()
        frappe.db.commit()
        return 'success'
    except Exception as e:
        frappe.log_error(_("Failed to update field: {0}".format(str(e))))
        return 'error'

@frappe.whitelist()
def create_payment_entry(
    order,
    customer,
    invoice,
    amount,
    mode_of_payment,
    received_amount,
    target_exchange_rate,
    source_exchange_rate,
    paid_to,
    paid_to_account_currency,
    paid_from,
    paid_from_account_currency,
    outstanding_amount
    ):
    payment_entry = frappe.new_doc('Payment Entry')
    amount, received_amount, outstanding_amount = float(amount), float(received_amount),\
                float(outstanding_amount)

    if amount == 0 :
        frappe.msgprint(
            msg = "'Received Amount' Can't be Zero!",
            title='Payment Cancelled',
        )
    elif amount > outstanding_amount :
        frappe.msgprint(
            msg = "'Paid Amount' Can't be Greater then The Outstanding Amount",
            title='Payment Cancelled',
        )
    else:

    # frappe.msgprint(invoice)
    # doc = frappe.get_doc('O Payment Entry', ope)

        payment_entry.party_type = 'Customer'
        payment_entry.party = customer
    # payment_entry.references = references

    # payment_entry.references.reference_doctype = 'Sales Invoice'
    # payment_entry.references.reference_name = invoice
    # payment_entry.references.allocated_amount = amount
    
    # for references table
        row = frappe.new_doc('Payment Entry Reference')
        row.reference_doctype = 'Sales Invoice'
        row.reference_name = invoice
        row.allocated_amount = amount
        payment_entry.append("references", row)

        payment_entry.paid_amount = amount  
        payment_entry.mode_of_payment = mode_of_payment



    # paid_to_account_currency
        payment_entry.received_amount = received_amount if (received_amount \
                        and received_amount != 0) else amount
        payment_entry.payment_type = 'Receive'

        payment_entry.target_exchange_rate = target_exchange_rate
        payment_entry.source_exchange_rate = source_exchange_rate


    # payment_entry.reference_doctype = 'Sales Invoice'
    # payment_entry.reference_name = invoice
    # payment_entry.company = company
    
        payment_entry.paid_to = paid_to
        payment_entry.paid_to_account_currency = paid_to_account_currency
        payment_entry.paid_from = paid_from
        payment_entry.paid_from_account_currency = paid_from_account_currency
    #   payment_entry.base_paid_amount = base_paid_amount
    #   payment_entry.base_received_amount = base_received_amount
    
        payment_entry.flags.ignore_permissions = True
        payment_entry.insert()
        payment_entry.submit()

    return payment_entry

