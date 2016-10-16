module Races.Update exposing (..)

import Races.Model exposing (Race)

import Races.Msg exposing (Msg(..))

import Navigation

update : Msg -> List Race -> ( List Race, Cmd Msg )
update msg races =
  case msg of
    Add ->
      ( races, Cmd.none )

    ShowRaces ->
      ( races, Navigation.newUrl "#races" )

