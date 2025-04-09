# import frappe
# from frappe import _

# @frappe.whitelist(allow_guest=True)
# def hello():
#     """
#     Simple test endpoint that returns a greeting
#     """
#     try:
#         # Handle CORS directly here to avoid the middleware
#         origin = frappe.request.headers.get('Origin')
#         if origin and hasattr(frappe, 'response') and hasattr(frappe.response, 'headers'):
#             frappe.response.headers['Access-Control-Allow-Origin'] = origin
#             frappe.response.headers['Access-Control-Allow-Credentials'] = 'true'
        
#         # Return a simple message
#         return {
#             "message": "Hello from Frappe!",
#             "success": True
#         }
#     except Exception as e:
#         frappe.log_error(f"Hello API error: {str(e)}")
#         return {"error": str(e)}

import frappe

@frappe.whitelist(allow_guest=True)
def hello():
    """
    Simple test endpoint that returns a greeting
    """
    return {"message": "Hello from Frappe!", "success": True}