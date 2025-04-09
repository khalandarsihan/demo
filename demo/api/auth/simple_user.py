# demo/api/auth/simple_user.py
import frappe

@frappe.whitelist(allow_guest=True)
def get_user():
    """
    Simple endpoint to get the current user
    """
    try:
        user = frappe.session.user
        return {
            "message": "Authenticated" if user != "Guest" else "Not authenticated",
            "user": user if user != "Guest" else None
        }
    except Exception as e:
        frappe.log_error(f"Error getting user: {str(e)}")
        return {"error": str(e)}