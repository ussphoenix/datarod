CREATE DATABASE datarod;

CREATE USER 'backend'@'%'  IDENTIFIED BY '0f203eb839e64cff091eec9d9cee0162';

GRANT PROCESS           ON *.*                  TO 'backend'@'%';
GRANT ALL PRIVILEGES    ON `datarod`.*          TO 'backend'@'%';
GRANT ALL PRIVILEGES    ON `test_datarod%`.*    TO 'backend'@'%';