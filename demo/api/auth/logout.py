import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def logout_user():
    """
    Logout the current user with CORS support
    """
    # Add CORS headers
    origin = frappe.request.headers.get('Origin')
    if origin:
        frappe.response.headers.update({
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-Frappe-CSRF-Token, Authorization'
        })
    
    # If this is a preflight OPTIONS request, return early
    if frappe.request.method == 'OPTIONS':
        return {}
    
    try:
        # Only logout if user is not guest
        if frappe.session.user and frappe.session.user != "Guest":
            frappe.local.login_manager.logout()
            return {
                "message": "Logged Out"
            }
        else:
            return {
                "message": "Not logged in"
            }
    except Exception as e:
        frappe.log_error(f"Logout error: {str(e)}")
        return {"error": str(e)}
