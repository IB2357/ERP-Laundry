# Copyright (c) 2023, Ibrahim Sultan Al-Wajih and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class OPaymentEntry(Document):
	def onload(self):
		IOA = frappe.db.get_value('Sales Invoice',self.invoice,'outstanding_amount')
		# frappe.msgprint(str(IOA))
		self.outstanding_amount = IOA