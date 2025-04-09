# demo/api/auth/simple_login.py
import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def login():
    """
    Simplified login endpoint
    """
    try:
        # Get username and password from form_dict
        username = frappe.form_dict.get('username')
        password = frappe.form_dict.get('password')
        
        if not username or not password:
            return {"error": "Username and password are required"}
            
        # Authenticate the user
        frappe.local.login_manager.authenticate(username, password)
        frappe.local.login_manager.post_login()
        
        # Return success response
        return {
            "message": "Logged In",
            "user": frappe.session.user
        }
    except Exception as e:
        frappe.log_error(f"Simple login failed: {str(e)}")
        return {"error": str(e)}