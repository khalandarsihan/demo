# demo/api/auth/simple_logout.py
import frappe

@frappe.whitelist(allow_guest=True)
def logout():
    """
    Simple logout endpoint
    """
    try:
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