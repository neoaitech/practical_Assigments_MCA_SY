from app import welcome

def test_welcome():
    assert welcome("Jenkins") == "Hello Jenkins, Jenkins CI Pipeline Working!"