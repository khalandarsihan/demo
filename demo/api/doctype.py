# demo/api/doctype.py
import frappe

@frappe.whitelist(allow_guest=True)
def get_doctypes():
    """
    Get a list of all DocTypes in the system
    """
    try:
        # Get a list of all DocTypes
        doctypes = frappe.get_all("DocType", 
                                 filters={"custom": 0}, 
                                 fields=["name", "module", "modified"],
                                 limit=50)  # Add limit to prevent too many results
        
        # Return in the format that Frappe expects for API methods
        return doctypes
    except Exception as e:
        frappe.log_error(f"Error fetching DocTypes: {str(e)}")
        return {"error": str(e)}