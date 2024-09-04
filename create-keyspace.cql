CREATE KEYSPACE IF NOT EXISTS jaeger_v1_test
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
