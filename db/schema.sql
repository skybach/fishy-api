CREATE TABLE api_lookup_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain_name VARCHAR(255) NOT NULL,
    ipv4_addresses JSON NOT NULL,
    client_ip VARCHAR(255) NOT NULL,
    lookup_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
