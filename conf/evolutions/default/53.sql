# --- !Ups
CREATE TABLE next_mission
(
    next_mission_id SERIAL NOT NULL,
    user_id TEXT NOT NULL,
    mission_type_id INT NOT NULL,
    missions_remaining INT NOT NULL,
    PRIMARY KEY (next_mission_id),
    FOREIGN KEY (user_id) REFERENCES sidewalk_user(user_id),
    FOREIGN KEY (mission_type_id) REFERENCES mission_type(mission_type_id)
);

INSERT INTO next_mission (user_id, mission_type_id, missions_remaining)
SELECT user_id, 2, 2 FROM sidewalk_user;

# --- !Downs
DROP TABLE next_mission;
