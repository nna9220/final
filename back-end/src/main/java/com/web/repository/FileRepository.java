package com.web.repository;

import com.web.entity.FileComment;
import com.web.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<FileComment, Integer> {
    @Query("select f from FileComment f where f.name=:name")
    public FileComment getFileByName(String name);

    @Query("select f from FileComment f where f.taskId=:task")
    public List<FileComment> findAllByTask(Task task);
}
