import frappe

def apply_cors():
    """Apply CORS headers for API requests"""
    # Early exit if no request
    if not frappe or not hasattr(frappe, 'request') or not frappe.request:
        return
        
    # Get origin from request
    origin = frappe.request.headers.get('Origin')
    if not origin:
        return
        
    # Create response headers
    cors_headers = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Frappe-CSRF-Token, Authorization, X-Requested-With',
    }
    
    # Ensure frappe.response and frappe.response.headers exist
    if not hasattr(frappe, 'response') or frappe.response is None:
        frappe.response = type('Response', (), {})()
        
    if not hasattr(frappe.response, 'headers'):
        frappe.response.headers = {}
        
    # Add CORS headers
    for key, value in cors_headers.items():
        frappe.response.headers[key] = value
    
    # Handle preflight OPTIONS requests
    if frappe.request.method == 'OPTIONS':
        frappe.local.response["http_status_code"] = 204
        frappe.local.response["message"] = "No Content"
        return "no content"