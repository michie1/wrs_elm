module Riders.Update exposing (setRiderAddName, addRider)

import App.Model exposing (App)
import Riders.Model exposing (Rider, RiderAdd)
import App.Msg exposing (Msg(..))
import Navigation

addRider : App -> Rider ->  ( App, Cmd Msg )
addRider app rider =
    let
        newRider = setRiderId rider app.riders
        newApp = setRiderAdd app (clearRiderName app.riderAdd.rider)
    in
        ( { newApp | 
                riders = (List.append [ newRider ] app.riders)
          }
        , Navigation.newUrl ("#riders/" ++ (toString newRider.id))
        )

setRiderAddName : App -> String -> ( App, Cmd Msg )
setRiderAddName app newName =
    ( setRiderAdd app ( setRiderName app.riderAdd.rider newName )
    , Cmd.none
    )

setRiderAdd : App -> Rider -> App
setRiderAdd app newRider =
    { app | 
        riderAdd = (setRider app.riderAdd newRider) 
    }

setRiderName : Rider -> String -> Rider
setRiderName rider name =
    { rider | name = name }


clearRiderName : Rider -> Rider
clearRiderName rider =
    setRiderName rider ""

setRider : RiderAdd -> Rider -> RiderAdd
setRider riderAdd rider =
    { riderAdd | rider = rider }

calcRiderId : List Rider -> Int
calcRiderId riders = 
    ( List.length riders ) + 1
        
setRiderId : Rider -> List Rider -> Rider
setRiderId rider riders =
    let 
        id = calcRiderId riders
    in 
        { rider | id = id }

