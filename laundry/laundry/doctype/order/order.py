# Copyright (c) 2023, Ibrahim Sultan Al-Wajih and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Order(Document):
	def onload(self):
		IOA = frappe.db.get_value('Sales Invoice',self.invoice,'outstanding_amount')
		# frappe.msgprint(str(IOA))
		self.outstanding_amount = IOA
		# self.oa = IOA
		
	def before_insert(self):
		self.get_items_table()
		# for i in frappe.get_roles():
		# 	frappe.msgprint(i)

	def get_items_table(self):
		invoice = frappe.get_doc('Sales Invoice',self.invoice)
		if invoice.items:
			self.items = invoice.items
	

	
	# @frappe.whitelist()
	# def f(self):
	# 	frappe.msgprint(self.name)
# laundry.laundry.doctype.order.order.Order.f

