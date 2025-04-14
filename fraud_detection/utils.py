import joblib
import numpy as np

# Rule-based logic (10000 thi vadhu => suspicious)
def is_suspicious_transaction(amount):
    return amount > 10000
