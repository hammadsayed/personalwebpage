import datetime
from pyscript import display

def main():
    # This code runs inside the browser!
    
    current_time = datetime.datetime.now()
    formatted_time = current_time.strftime("%Y-%m-%d %H:%M:%S")
    
    message = f"""
    [PYTHON KERNEL INITIALIZED]
    ---------------------------
    Current System Time: {formatted_time}
    
    > Hello, Hammad! 
    > Python is now running natively in your browser.
    > No server required.
    
    [CALCULATION DEMO]
    If you are 13 years old...
    You have been alive for approximately {13 * 365 * 24 * 60 * 60:,} seconds.
    
    > Ready for input...
    """
    
    # Write to the div with id="py-output"
    display(message, target="py-output")

# Execute main function
main()
