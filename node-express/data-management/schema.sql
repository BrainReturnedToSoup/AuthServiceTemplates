CREATE TABLE Users (
	user_id UUID,
	email_username VARCHAR(35) NOT NULL UNIQUE,
	pw VARCHAR(70) NOT NULL,
	
	PRIMARY KEY (user_id)
);

CREATE TABLE Third_Parties (
	third_party_id UUID,
	third_party_name VARCHAR(60),
	third_party_uri VARCHAR(1000),
		
	PRIMARY KEY (third_party_id)
);

CREATE TABLE User_Sessions (
	grant_id UUID,
	user_id UUID NOT NULL,
	jti UUID NOT NULL,
	expiration TIMESTAMP NOT NULL,
	
	PRIMARY KEY (grant_id),
	FOREIGN KEY (user_id) REFERENCES Users (user_id)
);

CREATE TABLE Third_Party_Sessions (
	grant_id UUID,
	user_id UUID NOT NULL,
	third_party_id UUID NOT NULL,
	auth SMALLINT NOT NULL,
	expiration TIMESTAMP NOT NULL,
	
	PRIMARY KEY (grant_id),
	FOREIGN KEY (user_id) REFERENCES Users (user_id),
	FOREIGN KEY (third_party_id) REFERENCES Third_Parties (third_party_id)
);

CREATE INDEX users_hash ON Users USING hash(user_id);
CREATE INDEX user_sessions_hash ON User_Sessions USING hash(grant_id);
CREATE INDEX third_parties_hash ON Third_Parties USING hash(third_party_id);
CREATE INDEX third_party_sessions_hash ON Third_Party_Sessions USING hash(grant_id);

CREATE INDEX user_sessions_exp ON User_Sessions (expiration);
CREATE INDEX third_party_sessions_exp ON Third_Party_Sessions (expiration);

CREATE INDEX users_email_username ON Users (email_username);