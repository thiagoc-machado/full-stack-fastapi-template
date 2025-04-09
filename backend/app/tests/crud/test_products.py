def test_create_product(client, superuser_token_headers):
    data = {
        'name': 'Producto Test',
        'description': 'Descripción de prueba',
        'price': 10.0,
        'quantity': 5,
        'category': 'Test'
    }
    response = client.post('/api/v1/products/', headers=superuser_token_headers, json=data)
    assert response.status_code == 200
    content = response.json()
    assert content['name'] == data['name']
    assert content['price'] == data['price']

def test_read_products(client, superuser_token_headers):
    response = client.get('/api/v1/products/', headers=superuser_token_headers)
    assert response.status_code == 200
    content = response.json()
    assert isinstance(content, list)

def test_read_product_by_id(client, superuser_token_headers):
    # Criar primeiro
    data = {
        'name': 'Leer por ID',
        'description': 'test',
        'price': 15.0,
        'quantity': 3,
        'category': 'ID'
    }
    create_resp = client.post('/api/v1/products/', headers=superuser_token_headers, json=data)
    assert create_resp.status_code == 200
    product_id = create_resp.json()['id']

    # Buscar pelo ID
    response = client.get(f'/api/v1/products/{product_id}', headers=superuser_token_headers)
    assert response.status_code == 200
    content = response.json()
    assert content['id'] == product_id
    assert content['name'] == data['name']

def test_update_product(client, superuser_token_headers):
    # Criar produto
    data = {
        'name': 'Actualizar',
        'description': 'original',
        'price': 20.0,
        'quantity': 4,
        'category': 'Update'
    }
    create_resp = client.post('/api/v1/products/', headers=superuser_token_headers, json=data)
    assert create_resp.status_code == 200
    product_id = create_resp.json()['id']

    # Atualizar produto
    update_data = {
        'name': 'Actualizado',
        'price': 30.0
    }
    response = client.put(f'/api/v1/products/{product_id}', headers=superuser_token_headers, json=update_data)
    assert response.status_code == 200
    content = response.json()
    assert content['name'] == update_data['name']
    assert content['price'] == update_data['price']

def test_delete_product(client, superuser_token_headers):
    # Criar produto
    data = {
        'name': 'Eliminar',
        'description': 'delete me',
        'price': 5.0,
        'quantity': 1,
        'category': 'Delete'
    }
    create_resp = client.post('/api/v1/products/', headers=superuser_token_headers, json=data)
    assert create_resp.status_code == 200
    product_id = create_resp.json()['id']

    # Deletar produto
    response = client.delete(f'/api/v1/products/{product_id}', headers=superuser_token_headers)
    assert response.status_code == 200
    content = response.json()
    assert content['message'] == 'Producto eliminado correctamente'

    # Confirmar que não existe mais
    get_resp = client.get(f'/api/v1/products/{product_id}', headers=superuser_token_headers)
    assert get_resp.status_code == 404
