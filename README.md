# Odoo Utils

A VSCode extension with utility tools for Odoo development.

## Features

- **Check Duplicate Function Definitions**: Detect duplicate function definitions in Python files

## Usage

1. Open a Python file
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. Type "Odoo: Check Duplicate Functions" and press Enter

The extension will check for duplicate function names in the current file and show results in the Output panel.

## Example

```python
class ProductTemplate(models.Model):
    _inherit = 'product.template'
    
    def calculate_price(self):
        # First implementation
        return self.list_price * 1.1
    
    def other_method(self):
        pass
        
    def calculate_price(self):  # ⚠️ Duplicate detected!
        # Accidentally wrote the same function again
        return self.list_price * 1.2
```

## License

MIT