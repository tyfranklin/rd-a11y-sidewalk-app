# --- !Ups
CREATE TABLE next_mission
(
    next_mission_id SERIAL NOT NULL,
    mission_type_id INT NOT NULL,
    missions_remaining INT NOT NULL,
    PRIMARY KEY (next_mission_id),
    FOREIGN KEY (mission_type_id) REFERENCES mission_type(mission_type_id)
);

# --- !Downs
DROP TABLE next_mission;
