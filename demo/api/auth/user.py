# demo/api/auth/user.py
import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_current_user():
    """
    Get the current logged-in user with CORS support
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
        # Return user info - including for guest
        user = frappe.session.user
        message = "Authenticated" if user != "Guest" else "Not authenticated"
        
        return {
            "message": message,
            "user": user if user != "Guest" else None
        }
    except Exception as e:
        frappe.log_error(f"Error getting user: {str(e)}")
        return {"error": str(e)}