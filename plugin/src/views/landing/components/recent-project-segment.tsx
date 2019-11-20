import React from "react";
import { Link } from "react-router-dom";

const RecentProjectsSegment = ({ projects }) => (
    <div className="section">
        <div className="section__title">
            <i className="fa fa-list-ul mr-2" aria-hidden="true"></i>
            <span>Recent projects</span>
        </div>
        {Object.values(projects).map((project: any) => {
            const { projectId, projectName, createdAt } = project;
            return (
                <div key={projectId} className="group">
                    <Link to={`/projects/${projectId}`}>
                        <div className="list-box">
                            <div>
                                <div className="title">{projectName}</div>
                                <div className="date">{createdAt}</div>
                            </div>
                            <i className="fa fa-chevron-right chevron" aria-hidden="true"></i>
                        </div>
                    </Link>
                </div>
            );
        })}
    </div>
);

export default RecentProjectsSegment;