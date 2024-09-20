CREATE TABLE notifications (
    notifications_id INT AUTO_INCREMENT NOT NULL,
    notifications_type VARCHAR(100) NOT NULL,
    notifications_refer_id INT NOT NULL,
    notifications_description VARCHAR(500) NOT NULL,
    PRIMARY KEY (notifications_id)
);

CREATE TABLE users (
    users_id INT AUTO_INCREMENT NOT NULL,
    users_name VARCHAR(100) NOT NULL,
    users_lastname VARCHAR(100) NOT NULL,
    users_username VARCHAR(100) NOT NULL,
    users_password VARCHAR(100) NOT NULL,
    users_description VARCHAR(500),
    users_photo LONGBLOB,
    users_private BOOLEAN NOT NULL,
    PRIMARY KEY (users_id)
);

CREATE TABLE posts (
    posts_id INT AUTO_INCREMENT NOT NULL,
    users_id INT NOT NULL,
    posts_photo LONGBLOB NOT NULL,
    posts_description VARCHAR(500) NOT NULL,
    posts_created_at DATETIME NOT NULL,
    posts_hidden BOOLEAN NOT NULL,
    posts_deleted BOOLEAN NOT NULL,
    PRIMARY KEY (posts_id)
);

CREATE TABLE comments (
    comments_id INT AUTO_INCREMENT NOT NULL,
    users_id INT NOT NULL,
    posts_id INT NOT NULL,
    comments_description VARCHAR(500) NOT NULL,
    comments_created_at DATETIME NOT NULL,
    PRIMARY KEY (comments_id)
);

CREATE TABLE likes (
    likes_id INT AUTO_INCREMENT NOT NULL,
    users_id INT NOT NULL,
    posts_id INT NOT NULL,
    PRIMARY KEY (likes_id)
);

CREATE TABLE follows (
    follows_id INT AUTO_INCREMENT NOT NULL,
    users_id INT NOT NULL,
    follows_followed INT NOT NULL,
    follows_accepted BOOLEAN NOT NULL,
    PRIMARY KEY (follows_id)
);

ALTER TABLE
    follows
ADD
    CONSTRAINT users_follows_fk FOREIGN KEY (users_id) REFERENCES users (users_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    posts
ADD
    CONSTRAINT users_posts_fk FOREIGN KEY (users_id) REFERENCES users (users_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    likes
ADD
    CONSTRAINT users_likes_fk FOREIGN KEY (users_id) REFERENCES users (users_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    comments
ADD
    CONSTRAINT users_comments_fk FOREIGN KEY (users_id) REFERENCES users (users_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    likes
ADD
    CONSTRAINT posts_likes_fk FOREIGN KEY (posts_id) REFERENCES posts (posts_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE
    comments
ADD
    CONSTRAINT posts_comments_fk FOREIGN KEY (posts_id) REFERENCES posts (posts_id) ON DELETE NO ACTION ON UPDATE NO ACTION;