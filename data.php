<?php

// Database details
$db_server = 'localhost';
$db_username = 'root';
$db_password = '';
$db_name = 'projeto';

// Get job (and id)
$job = '';
$id = '';
if (isset($_GET['job'])) {
    $job = $_GET['job'];
    if ($job == 'get_negociacoes' ||
            $job == 'form_negociacao' ||
            $job == 'add_negociacao' ||
            $job == 'edit_negociacao' ||
            $job == 'delete_negociacao') {
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            if (!is_numeric($id)) {
                $id = '';
            }
        }
    } else {
        $job = '';
    }
}

// Prepare array
$mysql_data = array();

// Valid job found
if ($job != '') {

    // Conectar com o banco de dados
    $db_connection = mysqli_connect($db_server, $db_username, $db_password, $db_name);
    if (mysqli_connect_errno()) {
        $result = 'error';
        $message = 'Failed to connect to database: ' . mysqli_connect_error();
        $job = '';
    }

    // Executar job
    if ($job == 'get_negociacoes') {

        // Get Negociacoes
        $query = "SELECT * FROM it_negociacoes ORDER BY negocio_id";
        $query = mysqli_query($db_connection, $query);
        if (!$query) {
            $result = 'error';
            $message = 'query error';
        } else {
            $result = 'success';
            $message = 'query success';
            while ($negocio = mysqli_fetch_array($query)) {
                $functions = '<div class="function_buttons"><ul>';
                $functions .= '<li class="function_edit"><a data-id="' . $negocio['negocio_id'] . '" data-name="' . $negocio['mercadoria_name'] . '"><span>Edit</span></a></li>';
                $functions .= '<li class="function_delete"><a data-id="' . $negocio['negocio_id'] . '" data-name="' . $negocio['mercadoria_name'] . '"><span>Delete</span></a></li>';
                $functions .= '</ul></div>';
                $mysql_data[] = array(
                    "negocio_id" => $negocio['negocio_id'],
                    "mercadoria_name" => $negocio['mercadoria_name'],
                    "descricao" => $negocio['descricao'],
                    "tipomercadoria" => $negocio['tipomercadoria'],
                    "preco" => '$ ' . $negocio['preco'],
                    "quantidade" => number_format($negocio['quantidade'], 0, '.', ','),
                    "tiponegociacao" => $negocio['tiponegociacao'],
                    "functions" => $functions
                );
            }
        }
    } elseif ($job == 'form_negociacao') {

        // Get Negociacao
        if ($id == '') {
            $result = 'error';
            $message = 'id missing';
        } else {
            $query = "SELECT * FROM it_negociacoes WHERE negocio_id = '" . mysqli_real_escape_string($db_connection, $id) . "'";
            $query = mysqli_query($db_connection, $query);
            if (!$query) {
                $result = 'error';
                $message = 'query error';
            } else {
                $result = 'success';
                $message = 'query success';
                while ($negocio = mysqli_fetch_array($query)) {
                    $mysql_data[] = array(
                        "mercadoria_name" => $negocio['mercadoria_name'],
                        "descricao" => $negocio['descricao'],
                        "tipomercadoria" => $negocio['tipomercadoria'],
                        "preco" => $negocio['preco'],
                        "quantidade" => $negocio['quantidade'],
                        "tiponegociacao" => $negocio['tiponegociacao']
                    );
                }
            }
        }
    } elseif ($job == 'add_negociacao') {

        // Add Negociação
        $query = "INSERT INTO it_negociacoes SET ";

        if (isset($_GET['mercadoria_name'])) {$query .= "mercadoria_name = '" . mysqli_real_escape_string($db_connection, $_GET['mercadoria_name']) . "', ";       }
        if (isset($_GET['descricao'])) {$query .= "descricao   = '" . mysqli_real_escape_string($db_connection, $_GET['descricao']) . "', ";        }
        if (isset($_GET['tipomercadoria'])) {$query .= "tipomercadoria      = '" . mysqli_real_escape_string($db_connection, $_GET['tipomercadoria']) . "', ";        }
        if (isset($_GET['preco'])) {$query .= "preco  = '" . mysqli_real_escape_string($db_connection, $_GET['preco']) . "', ";        }        
        if (isset($_GET['quantidade'])) {$query .= "quantidade    = '" . mysqli_real_escape_string($db_connection, $_GET['quantidade']) . "', ";        }
        if (isset($_GET['tiponegociacao'])) {$query .= "tiponegociacao = '" . mysqli_real_escape_string($db_connection, $_GET['tiponegociacao']) . "'";        }
        
        $query = mysqli_query($db_connection, $query);
        if (!$query) {
            $result = 'error';
            $message = 'query error';
        } else {
            $result = 'success';
            $message = 'query success';
        }
    } elseif ($job == 'edit_negociacao') {

        // Edit Negociacao
        if ($id == '') {
            $result = 'error';
            $message = 'id missing';
        } else {
            $query = "UPDATE it_negociacoes SET ";

            if (isset($_GET['mercadoria_name'])) {$query .= "mercadoria_name = '" . mysqli_real_escape_string($db_connection, $_GET['mercadoria_name']) . "', ";}
            if (isset($_GET['descricao'])) {$query .= "descricao   = '" . mysqli_real_escape_string($db_connection, $_GET['descricao']) . "', ";}
            if (isset($_GET['tipomercadoria'])) {$query .= "tipomercadoria      = '" . mysqli_real_escape_string($db_connection, $_GET['tipomercadoria']) . "', ";}
            if (isset($_GET['preco'])) {$query .= "preco  = '" . mysqli_real_escape_string($db_connection, $_GET['preco']) . "', ";}
            if (isset($_GET['quantidade'])) {$query .= "quantidade    = '" . mysqli_real_escape_string($db_connection, $_GET['quantidade']) . "', ";}
            if (isset($_GET['tiponegociacao'])) {$query .= "tiponegociacao = '" . mysqli_real_escape_string($db_connection, $_GET['tiponegociacao']) . "'";}
            
            $query .= "WHERE negocio_id = '" . mysqli_real_escape_string($db_connection, $id) . "'";
            $query = mysqli_query($db_connection, $query);
            if (!$query) {
                $result = 'error';
                $message = 'query error';
            } else {
                $result = 'success';
                $message = 'query success';
            }
        }
    } elseif ($job == 'delete_negociacao') {

        // Delete Negociacao
        if ($id == '') {
            $result = 'error';
            $message = 'id missing';
        } else {
            $query = "DELETE FROM it_negociacoes WHERE negocio_id = '" . mysqli_real_escape_string($db_connection, $id) . "'";
            $query = mysqli_query($db_connection, $query);
            if (!$query) {
                $result = 'error';
                $message = 'query error';
            } else {
                $result = 'success';
                $message = 'query success';
            }
        }
    }

    // Fechar conexão com o banco de dados
    mysqli_close($db_connection);
}

// Preparar dados
$data = array(
    "result" => $result,
    "message" => $message,
    "data" => $mysql_data
);

// Converter PHP array para JSON array
$json_data = json_encode($data);
print $json_data;
?>