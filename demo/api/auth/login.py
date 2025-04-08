import frappe
from frappe import _
import json

@frappe.whitelist(allow_guest=True)
def login_with_cors():
    """
    Custom login endpoint with CORS support
    """
    # Add CORS headers
    origin = frappe.request.headers.get('Origin')
    if origin:
        frappe.response.headers.update({
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-Frappe-CSRF-Token, Authorization'
        })
    
    # If this is a preflight OPTIONS request, return early
    if frappe.request.method == 'OPTIONS':
        return {}
    
    # Extract login credentials from request
    try:
        # Log the incoming request for debugging
        frappe.log_error(f"Login attempt with form_dict: {frappe.form_dict}")
        
        # Try to get username and password from form_dict
        username = frappe.form_dict.get('username')
        password = frappe.form_dict.get('password')
        
        # If not found in form_dict, try to parse the request body
        if not username or not password:
            # For JSON requests
            try:
                request_json = json.loads(frappe.request.data.decode('utf-8'))
                username = request_json.get('username') or request_json.get('usr')
                password = request_json.get('password') or request_json.get('pwd')
            except:
                pass
        
        # Final validation
        if not username or not password:
            frappe.throw(_("Username and password are required"))
            
        # Authenticate the user
        frappe.local.login_manager.authenticate(username, password)
        frappe.local.login_manager.post_login()
        
        # Return success response
        return {
            "message": "Logged In",
            "user": frappe.session.user
        }
    except Exception as e:
        frappe.log_error(f"Login failed: {str(e)}")
        return {"error": str(e)}
