"""Markdown to HTML:

This script converts an input markdown file
into an output HTML file.

This script requires the `markdown` and `time` 
modules as dependancies.

This file can be imported as a module with the functions:

    * get_input - Reads raw markdown from specified file.
    * process_input - Converts raw markdown into HTML code.
    * write_output - Writes HTML code to specified file.
    * main - the main function of the script.
"""

import argparse
import markdown
import time


def get_input(filepath: str) -> str:
    """
    Reads raw markdown from specified file

    Parameters
    ----------
    filepath : str
      A complete filepath for the input file

    Returns
    -------
    str
      The contents of the entire file
    """

    contents = ""
    with open(filepath, "r") as f:
        contents = f.read()

    return contents


def process_input(
    raw_markdown: str,
    new_tab: bool = True,
    one_line: bool = True,
    escape_chars: bool = True,
) -> str:
    """
    Converts raw markdown into HTML code

    Parameters
    ----------
    raw_markdown : str
      A string containing markdown-formatted text
    new_tab : bool (default True)
      Whether to make links open in new tabs
    one_line : bool (default True)
      Whether to make the output fit on one line
    escape_chars : bool (default True)
      Whether to escape any strings in the markdown

    Returns
    -------
    str
      Converted HTML code for the markdown
    """

    # Turn markdown into HTML
    raw_markdown = raw_markdown.replace("  -", "\t-")
    html = markdown.markdown(raw_markdown)

    # Make links open in new tabs
    if new_tab:
        html = html.replace("<a", '<a target="_blank"')

    # For JSON-pastabiity, make output single line.
    if one_line:
        html = html.replace("\n", "")
        html = html.replace("\r", "")

    # For JSON-pasability, escape string chars
    if escape_chars:
        html = html.replace('"', '\\"')
        html = html.replace("'", "\\'")

    return html


def write_output(
    html: str, filename: str = "output", filetype: str = ".txt", timestamp: bool = True
) -> None:
    """
    Writes html code to a specified file

    Parameters
    ----------
    html : str
      A string containing html code
    filename : str (default "output")
      The name of the output file
    filename : str (default ".txt")
      The type of the output file
    timestamp : bool (default True)
      Whether to add a timestamp to the filename

    Returns
    -------
    None
    """

    # Generate Timestamp
    stamp = ""
    if timestamp:
        stamp = "_" + time.strftime("%Y%m%d_%H%M%S")

    with open(f"./{filename}{stamp}{filetype}", "w") as f:
        f.write(html)


def main():
    # Setup arguments
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "input_file",
        type=str,
        help="The markdown file to read from",
        nargs="?",
        default="input.md",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=str,
        help="The output file to write HTML code to",
        default="output.txt",
    )
    parser.add_argument(
        "-t",
        "--timestamp",
        action="store_false",
        help="Turn off timestamps in output filename",
        default=True,
    )
    parser.add_argument(
        "-n",
        "--newtab",
        action="store_false",
        help="Don't set links to open in new tabs",
        default=True,
    )
    parser.add_argument(
        "-e",
        "--escapechars",
        action="store_false",
        help="Don't escape string characters in HTML",
        default=True,
    )
    parser.add_argument(
        "-l" "--oneline",
        action="store_false",
        help="Turn off one line output",
        default=True,
    )

    # Unpack args
    args = parser.parse_args()
    input_file = args.input_file
    newtab = args.newtab
    # Unsure why this has different name.
    # Discovered discrepancy by running print(args)
    oneline = args.l__oneline
    escapechars = args.escapechars
    timestamp = args.timestamp
    output = args.output
    filename, filetype = output.split(".")
    filetype = "." + filetype

    # Run script
    raw = get_input(input_file)
    print("Input read")
    html = process_input(raw, newtab, oneline, escapechars)
    print("Markdown converted")
    write_output(html, filename, filetype, timestamp)
    print("Output written")


if __name__ == "__main__":
    main()
