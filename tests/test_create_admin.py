import requests

url_base = "http://localhost:8080"

def login_admin(email, password):
    url = f"{url_base}/api/auth/login"
    headers = {
        "Content-Type": "application/json"
    }

    payload = {
        "email": email,
        "password": password
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        token = response.json().get("token")
        return token
    else:
        return False

def test_create_admin(token):
    url = f"{url_base}/administrators"
    payload = {
        "cpf": "12345678900",
        "name": "João Silva",
        "email": "joao.silva@example.com",
        "phone": "11999999999",
        "password": "senha123",
        "type": "ADMINISTRATOR"
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    print(headers)
    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        print("Administrador criado com sucesso!")
        print(response.json())
    else:
        print(f"Erro {response.status_code}: {response.text}")


token = login_admin("admin@gmail.com","123456")
print(token)
if token:
    test_create_admin(token)
