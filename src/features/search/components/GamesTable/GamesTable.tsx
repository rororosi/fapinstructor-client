import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import {
  Table,
  TableHead,
  TableFooter,
  TableRow,
  TableCell,
  TablePagination,
  TextField,
  Typography,
  TableSortLabel,
} from "@material-ui/core";

import {
  AsyncTableBody,
  DateColumn,
  RouteColumn,
  TagsColumn,
  StarsColumn,
  SpanningTableCell,
} from "@/components/Elements";
import { GameRecord } from "@/types/GameRecord";
import { TagsField } from "@/features/tags";
import {
  SearchGamesRequest,
  SearchGamesParams,
} from "@/common/api/schemas/games";
import { PaginateParams, Pagination } from "@/common/types/pagination";

export type GamesTableProps = {
  createdBy?: string;
  playedBy?: string;
  starredBy?: string;
  searchGames: (request: SearchGamesRequest) => void;
  games: GameRecord[];
  pagination: Pagination;
  loading: boolean;
  error?: string;
};

type SortDirection = "asc" | "desc" | undefined;

export default function GamesTable({
  createdBy,
  playedBy,
  starredBy,
  searchGames,
  games,
  pagination,
  loading,
  error,
}: GamesTableProps) {
  const [paginate, setPaginate] = useState<PaginateParams>({
    perPage: 10,
    currentPage: 1,
  });

  const [filters, setFilters] = useState<SearchGamesParams>({
    title: "",
    tags: [],
  });

  const [sort, setSort] = useState<{
    [key: string]: SortDirection;
  }>({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchGames = useCallback(debounce(searchGames, 500), []);

  useEffect(() => {
    const req: SearchGamesRequest = {
      createdBy,
      playedBy,
      starredBy,
      ...filters,
      ...paginate,
      sort: Object.entries(sort).map(([key, direction]) =>
        direction === "asc" ? key : `-${key}`
      ),
    };
    debouncedSearchGames(req);
  }, [
    debouncedSearchGames,
    filters,
    sort,
    createdBy,
    playedBy,
    starredBy,
    paginate,
  ]);

  const handlePageChange = (_event: unknown, page: number) => {
    setPaginate({
      ...paginate,
      currentPage: page + 1,
    });
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const perPage = Number(event.target.value);

    setPaginate({
      ...paginate,
      perPage,
    });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      title: event.target.value,
    });
    setPaginate({
      ...paginate,
      currentPage: 1,
    });
  };

  const handleTagsChange = (tags: string[]) => {
    setFilters({
      ...filters,
      tags,
    });
    setPaginate({
      ...paginate,
      currentPage: 1,
    });
  };

  function changeDirection(columnId: string) {
    const currentDirection = sort[columnId];

    let direction: SortDirection = undefined;
    switch (currentDirection) {
      case "asc":
        direction = "desc";
        break;
      case "desc": {
        direction = undefined;
        break;
      }
      case undefined: {
        direction = "asc";
        break;
      }
    }

    setSort({ ...sort, [columnId]: direction });
  }

  return (
    <Table aria-label="Games">
      <TableHead>
        <TableRow>
          <TableCell sortDirection={sort["stars"]}>
            <TableSortLabel
              active={!!sort["stars"]}
              direction={sort["stars"]}
              onClick={() => changeDirection("stars")}
            >
              Stars
            </TableSortLabel>
          </TableCell>
          <TableCell style={{ width: "50%" }} sortDirection={sort["title"]}>
            <TableSortLabel
              active={!!sort["title"]}
              direction={sort["title"]}
              onClick={() => changeDirection("title")}
            >
              Title
            </TableSortLabel>
          </TableCell>
          <TableCell sortDirection={sort["averageGameDuration"]}>
            <TableSortLabel
              active={!!sort["averageGameDuration"]}
              direction={sort["averageGameDuration"]}
              onClick={() => changeDirection("averageGameDuration")}
            >
              Average Game Duration
            </TableSortLabel>
          </TableCell>
          <TableCell>Tags</TableCell>
          <TableCell align="right" sortDirection={sort["updatedAt"]}>
            <TableSortLabel
              active={!!sort["updatedAt"]}
              direction={sort["updatedAt"]}
              onClick={() => changeDirection("updatedAt")}
            >
              Created On
            </TableSortLabel>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell />
          <TableCell>
            <TextField
              placeholder="Filter by title"
              value={filters.title}
              fullWidth
              inputProps={{
                maxLength: 50,
              }}
              onChange={handleTitleChange}
            />
          </TableCell>
          <TableCell />
          <SpanningTableCell>
            <TagsField value={filters.tags} onChange={handleTagsChange} />
          </SpanningTableCell>
        </TableRow>
      </TableHead>
      <AsyncTableBody loading={loading} error={error}>
        {games?.map(
          ({
            id,
            title,
            tags,
            stars,
            starred,
            updatedAt,
            averageGameDuration,
          }: GameRecord) => (
            <TableRow key={id}>
              <StarsColumn gameId={id} stars={stars} starred={starred} />
              <RouteColumn title={title} to={`/game/${id}`} />
              <TableCell>
                <Typography>{averageGameDuration}</Typography>
              </TableCell>
              <TagsColumn tags={tags} />
              <DateColumn date={updatedAt} align="right" />
            </TableRow>
          )
        )}
      </AsyncTableBody>
      <TableFooter>
        <TableRow>
          <TablePagination
            count={pagination && pagination.total}
            rowsPerPage={paginate.perPage}
            page={paginate.currentPage - 1}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableRow>
      </TableFooter>
    </Table>
  );
}