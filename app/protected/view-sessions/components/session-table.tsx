'use client'

import { Button } from '@/components/ui/button'
import { Session, TournamentSession } from '@/lib/interfaces'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Pencil, PencilRuler } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import CashSortBy from './cash-sort-by-form'
import TournamentSortBy from './tournament-sort-by-form'

export default function SessionTable({
  cashSessions,
  tournamentSessions,
}: {
  cashSessions: Session[]
  tournamentSessions: TournamentSession[]
}) {
  const formatDate = (date: string) => {
    const date_ = new Date(date)
    return `${date_.getMonth() + 1}/${date_.getDate()}/${date_.getFullYear() % 100}`
  }

  const formatTime = (date: string) => {
    const date_ = new Date(date)
    return `${date_.getHours() % 12 === 0 ? (date_.getHours() % 12) + 1 : date_.getHours() % 12}:${date_.getMinutes() < 10 ? '0' + date_.getMinutes() : date_.getMinutes()}${date_.getHours() > 12 ? 'PM' : 'AM'}`
  }

  return (
    <div className="flex flex-col items-center gap-2 bg-white p-8 drop-shadow-lg rounded-md">
      <div className="text-5xl font-bold text-center">View Sessions</div>
      <Tabs defaultValue="cash">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cash">Cash</TabsTrigger>
          <TabsTrigger value="tournament">Tournaments</TabsTrigger>
        </TabsList>
        <TabsContent value="cash">
          <div className="flex flex-col gap-6">
            <CashSortBy />
            <ScrollArea className="h-[350px] w-full rounded-md px-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Game Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Stakes</TableHead>
                    <TableHead>Buy in</TableHead>
                    <TableHead>Cash out</TableHead>
                    <TableHead>Net result</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Time Played</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cashSessions.map((session, index) => (
                    <TableRow key={index}>
                      <TableCell className="max-w-[120px] truncate">
                        {session.game_type}
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate">
                        {session.location}
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate">
                        {session.stake}
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate">
                        ${session.buyin}
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate">
                        ${session.cashout}
                      </TableCell>
                      {session.net_result !== null &&
                        session.net_result !== undefined && (
                          <TableCell
                            className={
                              session.net_result > 0
                                ? 'text-green-500'
                                : session.net_result < 0
                                  ? 'text-destructive'
                                  : 'text-black'
                            }
                          >
                            {session.net_result > 0
                              ? '+'
                              : session.net_result < 0
                                ? '-'
                                : ''}
                            ${Math.abs(session.net_result)}
                          </TableCell>
                        )}
                      <TableCell className="max-w-[120px] truncate">
                        <div className="flex flex-col justify-center">
                          <span>{formatDate(session.start_time)}</span>
                          <span>{formatTime(session.start_time)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate">
                        <div className="flex flex-col justify-center">
                          <span>{formatDate(session.end_time)}</span>
                          <span>{formatTime(session.end_time)}</span>
                        </div>
                      </TableCell>
                      {session.time_played && (
                        <TableCell className="max-w-[120px] truncate">
                          {Math.round(session.time_played * 100) / 100} Hours
                        </TableCell>
                      )}
                      {session.id && (
                        <TableCell className="max-w-[120px] truncate">
                          <Link
                            href={`/protected/add-cash-session?cash_session=${session.id}`}
                          >
                            <Button>
                              <PencilRuler />
                            </Button>
                          </Link>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </TabsContent>
        <TabsContent value="tournament">
          <div className="flex flex-col gap-6">
            <TournamentSortBy />
            <ScrollArea className="h-[350px] w-full rounded-md px-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Game Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Buy in</TableHead>
                    <TableHead>Cash out</TableHead>
                    <TableHead>Net Result</TableHead>
                    <TableHead>Placement</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Days Played</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tournamentSessions.map((session, index) => (
                    <TableRow key={index}>
                      <TableCell className="max-w-[120px] truncate">
                        {session.game_type}
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate">
                        {session.location}
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate">
                        ${session.buyin}
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate">
                        ${session.cashout}
                      </TableCell>
                      {session.net_result !== null &&
                        session.net_result !== undefined && (
                          <TableCell
                            className={
                              session.net_result > 0
                                ? 'text-green-500'
                                : session.net_result < 0
                                  ? 'text-destructive'
                                  : 'text-black'
                            }
                          >
                            {session.net_result > 0
                              ? '+'
                              : session.net_result < 0
                                ? '-'
                                : ''}
                            ${Math.abs(session.net_result)}
                          </TableCell>
                        )}
                      <TableCell className="max-w-[120px] truncate">
                        <span>{session.placement}</span>
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate">
                        <span>{formatDate(session.start_time)}</span>
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate">
                        <span>{formatDate(session.end_time)}</span>
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate">
                        {session.days}
                      </TableCell>
                      {session.id && (
                        <TableCell className="max-w-[120px] truncate">
                          <Link
                            href={`/protected/add-tournament-session?tournament_session=${session.id}`}
                          >
                            <Button>
                              <PencilRuler />
                            </Button>
                          </Link>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
