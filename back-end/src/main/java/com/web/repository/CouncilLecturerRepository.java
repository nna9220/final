package com.web.repository;

import com.web.entity.Council;
import com.web.entity.CouncilLecturer;
import com.web.entity.Lecturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CouncilLecturerRepository extends JpaRepository<CouncilLecturer,Integer> {
    @Query("select c from CouncilLecturer c where c.council=:council")
    public List<CouncilLecturer> getListCouncilLecturerByCouncil(Council council);
    //Tìm councillecturer thông qua lecturer và council
    @Query("select c from CouncilLecturer c where c.council=:council and c.lecturer=:lecturer")
    CouncilLecturer getCouncilLecturerByCouncilAndLecturer(Council council,Lecturer lecturer);
}
