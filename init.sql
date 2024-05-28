use registersubject;
ALTER TABLE register_period MODIFY registration_time_start datetime;
ALTER TABLE register_period MODIFY registration_time_end datetime;


ALTER TABLE register_period_lecturer MODIFY registration_time_start datetime;
ALTER TABLE register_period_lecturer MODIFY registration_time_end datetime;


ALTER TABLE time_add_subject_of_head MODIFY time_start datetime;
ALTER TABLE time_add_subject_of_head MODIFY time_end datetime;


ALTER TABLE time_brows_of_head MODIFY time_start datetime;
ALTER TABLE time_brows_of_head MODIFY time_end datetime;
